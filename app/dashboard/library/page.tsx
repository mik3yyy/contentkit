import { prisma } from "@/lib/db"
import AssetGrid from "./AssetGrid"
import { Suspense } from "react"

const NICHE_COLORS: Record<string, string> = {
  luxury:            "#c9a96e",
  fitness:           "#4ade80",
  travel:            "#38bdf8",
  gaming:            "#a78bfa",
  "digital-marketing": "#fb923c",
  nature:            "#86efac",
  satisfying:        "#f9a8d4",
  backgrounds:       "#94a3b8",
  "money-trading":   "#fbbf24",
  automotive:        "#f87171",
  "real-estate":     "#6ee7b7",
  motivation:        "#fcd34d",
  ebook:             "#e2e8f0",
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string; type?: string; tag?: string; q?: string; page?: string }>
}) {
  const { niche, type, tag, q, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1))
  const take = 36
  const skip = (page - 1) * take

  // Fetch all available niches dynamically
  const nicheRows = await prisma.content.findMany({
    select: { niche: true },
    distinct: ["niche"],
    orderBy: { niche: "asc" },
  })
  const niches = nicheRows.map(r => r.niche)

  // Fetch all tags used on ebooks
  const ebookRows = await prisma.content.findMany({
    where: { type: "ebook" },
    select: { tags: true },
  })
  const allTags = [...new Set(ebookRows.flatMap(r => r.tags))].sort()

  const where: Parameters<typeof prisma.content.findMany>[0]["where"] = {
    ...(niche && niche !== "all" ? { niche } : {}),
    ...(type  && type  !== "all" ? { type  } : {}),
    ...(tag   ? { tags: { has: tag } } : {}),
    ...(q     ? { title: { contains: q, mode: "insensitive" as const } } : {}),
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

  const totalPages = Math.ceil(total / take)

  function filterHref(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams()
    const merged = { niche: niche ?? "all", type: type ?? "all", tag, q, page: "1", ...updates }
    Object.entries(merged).forEach(([k, v]) => { if (v && v !== "all" && v !== "") params.set(k, v) })
    const s = params.toString()
    return s ? `?${s}` : "?"
  }

  return (
    <div className="max-w-[1260px] mx-auto px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-black">Library</h1>
          <p className="text-[14px] text-gray-500">{total.toLocaleString()} items</p>
        </div>
        {/* Search */}
        <form method="GET" className="flex items-center gap-2">
          {niche && <input type="hidden" name="niche" value={niche} />}
          {type  && <input type="hidden" name="type"  value={type}  />}
          {tag   && <input type="hidden" name="tag"   value={tag}   />}
          <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-black transition-all bg-white">
            <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search titles..."
              className="text-[13px] outline-none bg-transparent w-52"
            />
          </div>
        </form>
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 mb-4">
        {["all", "video", "ebook"].map(t => (
          <a key={t} href={filterHref({ type: t, tag: undefined })}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors capitalize ${
              (type === t) || (!type && t === "all")
                ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {t === "all" ? "All" : t === "video" ? "📹 Videos" : "📖 Ebooks"}
          </a>
        ))}
      </div>

      {/* Niche filters */}
      <div className="flex gap-2 flex-wrap mb-3">
        <a href={filterHref({ niche: "all" })}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors ${!niche || niche === "all" ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
          All niches
        </a>
        {niches.map(n => (
          <a key={n} href={filterHref({ niche: n })}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors capitalize ${niche === n ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
            {n.replace(/-/g, " ")}
          </a>
        ))}
      </div>

      {/* Tag filters (ebooks only) */}
      {(type === "ebook" || (!type && allTags.length > 0)) && (
        <div className="flex gap-2 flex-wrap mb-6">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider self-center">Tags:</span>
          {tag && (
            <a href={filterHref({ tag: undefined })}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-black text-white">
              ✕ {tag}
            </a>
          )}
          {allTags.filter(t => t !== tag).map(t => (
            <a key={t} href={filterHref({ tag: t })}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 capitalize transition-colors">
              {t.replace(/-/g, " ")}
            </a>
          ))}
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div className="text-center py-24 border border-gray-100 rounded-2xl">
          <p className="text-[18px] font-semibold text-gray-500 mb-2">No results</p>
          <p className="text-[14px] text-gray-400">Try a different filter or search term.</p>
        </div>
      ) : (
        <Suspense>
          <AssetGrid items={items} nicheColors={NICHE_COLORS} />
        </Suspense>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          {page > 1 && (
            <a href={filterHref({ page: String(page - 1) })} className="px-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium hover:border-gray-400 transition-colors">← Previous</a>
          )}
          <span className="text-[13px] text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <a href={filterHref({ page: String(page + 1) })} className="px-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium hover:border-gray-400 transition-colors">Next →</a>
          )}
        </div>
      )}
    </div>
  )
}
