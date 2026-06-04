"use client"

import { useState } from "react"

interface ContentItem {
  id: string
  title: string
  type: string
  niche: string
  thumbnailUrl: string | null
  fileSizeBytes: number | null
}

function AssetCard({ item }: { item: ContentItem }) {
  const [loading, setLoading] = useState(false)
  const [favorited, setFavorited] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/content/${item.id}/download`)
      const { url } = await res.json()
      if (url) window.open(url, "_blank")
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    const res = await fetch(`/api/content/${item.id}/favorite`, { method: "POST" })
    const { favorited: f } = await res.json()
    setFavorited(f)
  }

  const sizeLabel = item.fileSizeBytes
    ? item.fileSizeBytes > 1_000_000
      ? `${(item.fileSizeBytes / 1_000_000).toFixed(0)} MB`
      : `${(item.fileSizeBytes / 1_000).toFixed(0)} KB`
    : null

  return (
    <div className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden mb-2 bg-gray-900" style={{ aspectRatio: "3/4" }}>
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-gray-500 text-[11px] uppercase tracking-wider">{item.type}</span>
          </div>
        )}
        <button onClick={handleFavorite} className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${favorited ? "bg-red-500" : "bg-black/30 backdrop-blur-sm hover:bg-black/50"}`}>
          <svg width="11" height="11" fill={favorited ? "white" : "none"} stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <div className="absolute bottom-2 left-2">
          <span className="text-[9px] font-bold text-white uppercase tracking-wide bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 capitalize">{item.niche}</span>
        </div>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40"
        >
          <div className="bg-white text-black text-[12px] font-semibold px-4 py-2 rounded-xl">
            {loading ? "..." : "Download"}
          </div>
        </button>
      </div>
      <p className="text-[12px] font-medium text-gray-800 truncate">{item.title}</p>
      {sizeLabel && <p className="text-[11px] text-gray-400">{sizeLabel}</p>}
    </div>
  )
}

export default function AssetGrid({ items }: { items: ContentItem[] }) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {items.map(item => <AssetCard key={item.id} item={item} />)}
    </div>
  )
}
