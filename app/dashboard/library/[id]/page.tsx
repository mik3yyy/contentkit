import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"
import { notFound } from "next/navigation"
import VideoDetail from "./VideoDetail"

export default async function ClipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const item = await prisma.content.findUnique({
    where: { id },
    select: {
      id: true, title: true, type: true, niche: true, r2Key: true,
      thumbnailUrl: true, fileSizeBytes: true, durationSeconds: true, tags: true,
    },
  })
  if (!item) notFound()

  const [packItems, relatedItems] = await Promise.all([
    prisma.content.findMany({
      where: { niche: item.niche, type: item.type, id: { not: id } },
      select: { id: true, title: true, thumbnailUrl: true, durationSeconds: true, niche: true, type: true, tags: true },
      orderBy: { title: "asc" },
      take: 20,
    }),
    prisma.content.findMany({
      where: { niche: item.niche, type: item.type, id: { not: id } },
      select: { id: true, title: true, thumbnailUrl: true, durationSeconds: true, niche: true, type: true, tags: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ])

  let previewUrl: string | null = null
  if (item.type === "video") {
    try { previewUrl = await getDownloadUrl(item.r2Key) } catch { /* R2 not configured */ }
  }

  return (
    <VideoDetail
      item={item}
      packItems={packItems}
      relatedItems={relatedItems}
      previewUrl={previewUrl}
    />
  )
}
