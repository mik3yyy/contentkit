import { prisma } from "@/lib/db"
import AssetGrid from "./AssetGrid"

const NICHES = ["all","luxury","fitness","money","travel","motivation","food","gaming","nature","cars","business"]
const TYPES  = ["all","video","ebook","template","audio"]

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string; type?: string; page?: string }>
}) {
  const { niche, type, page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)
  const take = 30
  const skip = (page - 1) * take

  const where = {
    ...(niche && niche !== "all" ? { niche } : {}),
    ...(type  && type  !== "all" ? { type  } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.content.findMany({ where, take, skip, orderBy: { createdAt: "desc" } }),
    prisma.content.count({ where }),
  ])

  return (
    <div className="max-w-[1160px] mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-black">Library</h1>
          <p className="text-[14px] text-gray-500">{total.toLocaleString()} items</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {NICHES.map(n => (
          <a key={n} href={`?niche=${n}&type=${type ?? "all"}`}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors capitalize ${niche === n || (!niche && n === "all") ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
            {n === "all" ? "All niches" : n}
          </a>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {TYPES.map(t => (
          <a key={t} href={`?niche=${niche ?? "all"}&type=${t}`}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors capitalize ${type === t || (!type && t === "all") ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
            {t === "all" ? "All types" : t}
          </a>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-[18px] font-semibold text-gray-500 mb-2">No content yet</p>
          <p className="text-[14px] text-gray-400">Content will appear here once it&apos;s uploaded to the library.</p>
        </div>
      ) : (
        <AssetGrid items={items} />
      )}

      {/* Pagination */}
      {total > take && (
        <div className="flex items-center justify-center gap-3 mt-10">
          {page > 1 && (
            <a href={`?niche=${niche ?? "all"}&type=${type ?? "all"}&page=${page - 1}`} className="px-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium hover:border-gray-400 transition-colors">← Previous</a>
          )}
          <span className="text-[13px] text-gray-500">Page {page} of {Math.ceil(total / take)}</span>
          {page < Math.ceil(total / take) && (
            <a href={`?niche=${niche ?? "all"}&type=${type ?? "all"}&page=${page + 1}`} className="px-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium hover:border-gray-400 transition-colors">Next →</a>
          )}
        </div>
      )}
    </div>
  )
}
