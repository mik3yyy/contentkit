import { Readable } from "stream"
import { ZipArchive } from "archiver"
import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 300 // 5 min — streaming large zip

const PER_NICHE = 5 // clips sampled from each niche

function folderName(niche: string): string {
  if (niche === "money-finance") return "Money & Finance"
  return niche.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")
}

function safeFilename(title: string, key: string): string {
  const ext = key.split(".").pop()?.toLowerCase() ?? "mp4"
  const name = title.replace(/[/\\:*?"<>|]/g, "_").slice(0, 80)
  return `${name}.${ext}`
}

export async function GET() {
  const groups = await prisma.content.groupBy({
    by: ["niche"],
    where: { type: "video" },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  })

  const archive = new ZipArchive({ zlib: { level: 0 } })
  const webStream = Readable.toWeb(archive) as ReadableStream<Uint8Array>

  // Fill the archive concurrently with the streaming response
  ;(async () => {
    for (const group of groups) {
      const clips = await prisma.content.findMany({
        where: { type: "video", niche: group.niche },
        select: { r2Key: true, title: true },
        take: PER_NICHE,
        orderBy: { createdAt: "desc" },
      })

      const folder = folderName(group.niche)

      for (const clip of clips) {
        try {
          const url = await getDownloadUrl(clip.r2Key)
          const res = await fetch(url)
          if (!res.ok || !res.body) continue

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const nodeReadable = Readable.fromWeb(res.body as any)

          // Register done listener before appending to avoid missing the event
          const done = new Promise<void>((resolve, reject) => {
            archive.once("entry", resolve)
            nodeReadable.once("error", reject)
          })

          archive.append(nodeReadable, {
            name: `${folder}/${safeFilename(clip.title, clip.r2Key)}`,
          })

          await done
        } catch {
          // skip individual broken files
        }
      }
    }

    archive.finalize()
  })()

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="ContentKit-Free-Sample-Pack.zip"',
      "Cache-Control": "no-store",
    },
  })
}
