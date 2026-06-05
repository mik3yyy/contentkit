import { prisma } from "@/lib/db"
import LibraryClient from "./LibraryClient"

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string; type?: string; tag?: string; q?: string; page?: string }>
}) {
  const { niche, type, tag, q, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1))
  const take = 40
  const skip = (page - 1) * take

  // Dynamic niches from DB
  const nicheRows = await prisma.content.findMany({
    where: type && type !== "all" ? { type } : {},
    select: { niche: true },
    distinct: ["niche"],
    orderBy: { niche: "asc" },
  })
  const niches = nicheRows.map(r => r.niche)

  // Tags for ebooks
  const ebookTagRows = await prisma.content.findMany({
    where: { type: "ebook" },
    select: { tags: true },
  })
  const allTags = [...new Set(ebookTagRows.flatMap(r => r.tags))].sort()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    ...(niche && niche !== "all" ? { niche }                       : {}),
    ...(type  && type  !== "all" ? { type  }                       : {}),
    ...(tag                      ? { tags: { has: tag } }          : {}),
    ...(q                        ? { title: { contains: q, mode: "insensitive" } } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.content.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, type: true, niche: true,
        thumbnailUrl: true, fileSizeBytes: true, durationSeconds: true, tags: true,
      },
    }),
    prisma.content.count({ where }),
  ])

  return (
    <LibraryClient
      items={items}
      total={total}
      page={page}
      take={take}
      niches={niches}
      allTags={allTags}
      filters={{ niche, type, tag, q }}
    />
  )
}
