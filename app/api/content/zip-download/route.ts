import { NextRequest } from "next/server"
import JSZip from "jszip"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"

const MAX_ITEMS = 150

function safeFilename(title: string, type: string): string {
  const clean = title
    .replace(/#\S+/g, "")
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
  return (clean || "file") + (type === "ebook" ? ".pdf" : ".mp4")
}

function folderName(niche: string): string {
  return niche
    .replace(/-/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase())
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  if (!isDemo && !session.user?.hasPaid) return Response.json({ error: "Payment required" }, { status: 403 })

  const { ids, zipName } = await req.json() as { ids: string[]; zipName?: string }
  if (!Array.isArray(ids) || ids.length === 0) return Response.json({ error: "No ids" }, { status: 400 })
  if (ids.length > MAX_ITEMS) return Response.json({ error: `Max ${MAX_ITEMS} items per ZIP` }, { status: 400 })

  const items = await prisma.content.findMany({
    where: { id: { in: ids } },
    select: { id: true, title: true, type: true, niche: true, r2Key: true },
  })

  // Group by niche
  const byNiche = new Map<string, typeof items>()
  for (const item of items) {
    const arr = byNiche.get(item.niche) ?? []
    arr.push(item)
    byNiche.set(item.niche, arr)
  }

  const zip = new JSZip()

  // De-duplicate filenames within each folder
  for (const [niche, nicheItems] of byNiche) {
    const folder = zip.folder(folderName(niche))!
    const seen = new Map<string, number>()

    await Promise.all(
      nicheItems.map(async item => {
        try {
          const base = safeFilename(item.title, item.type)
          const count = (seen.get(base) ?? 0) + 1
          seen.set(base, count)
          const filename = count > 1
            ? base.replace(/(\.\w+)$/, ` (${count})$1`)
            : base

          const url = await getDownloadUrl(item.r2Key)
          const res = await fetch(url)
          if (!res.ok) return
          const buf = await res.arrayBuffer()
          folder.file(filename, buf, { compression: "STORE" })
        } catch {
          // skip failed items silently
        }
      })
    )
  }

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "STORE",   // no re-compression — videos are already compressed
  })

  const name = (zipName ?? "contentkit").replace(/[^a-zA-Z0-9 \-_]/g, "").trim()

  // Convert Buffer to Uint8Array for the Web Response API
  const body = new Uint8Array(zipBuffer)

  return new Response(body, {
    headers: {
      "Content-Type":        "application/zip",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(name)}.zip"`,
      "Content-Length":      String(body.byteLength),
    },
  })
}
