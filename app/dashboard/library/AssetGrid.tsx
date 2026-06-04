"use client"

import { useState } from "react"

interface ContentItem {
  id: string
  title: string
  type: string
  niche: string
  thumbnailUrl: string | null
  fileSizeBytes: number | null
  durationSeconds: number | null
  tags: string[]
}

function fmtSize(bytes: number | null) {
  if (!bytes) return null
  if (bytes > 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`
  return `${(bytes / 1_000).toFixed(0)} KB`
}

function fmtDuration(secs: number | null) {
  if (!secs) return null
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`
}

function VideoCard({ item, nicheColor }: { item: ContentItem; nicheColor: string }) {
  const [loading, setLoading] = useState(false)
  const [favorited, setFavorited] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/content/${item.id}/download`)
      const { url } = await res.json()
      if (url) window.open(url, "_blank")
    } finally { setLoading(false) }
  }

  const handleFavorite = async () => {
    const res = await fetch(`/api/content/${item.id}/favorite`, { method: "POST" })
    const { favorited: f } = await res.json()
    setFavorited(f)
  }

  return (
    <div className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden mb-2" style={{ aspectRatio: "9/16" }}>
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${nicheColor}22, ${nicheColor}44)` }}>
            <svg width="24" height="24" fill="none" stroke={nicheColor} strokeWidth="1.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: nicheColor }}>{item.niche.replace(/-/g, " ")}</span>
          </div>
        )}

        {/* Favorite */}
        <button onClick={handleFavorite}
          className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${favorited ? "bg-red-500 scale-110" : "bg-black/30 backdrop-blur-sm hover:bg-black/50"}`}>
          <svg width="11" height="11" fill={favorited ? "white" : "none"} stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Duration */}
        {item.durationSeconds && (
          <div className="absolute bottom-2 right-2">
            <span className="text-[9px] font-bold text-white bg-black/70 rounded px-1.5 py-0.5">{fmtDuration(item.durationSeconds)}</span>
          </div>
        )}

        {/* Niche badge */}
        <div className="absolute bottom-2 left-2">
          <span className="text-[9px] font-bold text-white uppercase tracking-wide bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 capitalize">
            {item.niche.replace(/-/g, " ")}
          </span>
        </div>

        {/* Download overlay */}
        <button onClick={handleDownload} disabled={loading}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40">
          <div className="bg-white text-black text-[12px] font-semibold px-4 py-2 rounded-xl shadow">
            {loading ? "..." : "↓ Download"}
          </div>
        </button>
      </div>

      <p className="text-[11.5px] font-medium text-gray-800 truncate">{item.title}</p>
      <p className="text-[10.5px] text-gray-400">{fmtSize(item.fileSizeBytes)}</p>
    </div>
  )
}

function EbookCard({ item }: { item: ContentItem }) {
  const [loading, setLoading] = useState(false)
  const [favorited, setFavorited] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/content/${item.id}/download`)
      const { url } = await res.json()
      if (url) window.open(url, "_blank")
    } finally { setLoading(false) }
  }

  const handleFavorite = async () => {
    const res = await fetch(`/api/content/${item.id}/favorite`, { method: "POST" })
    const { favorited: f } = await res.json()
    setFavorited(f)
  }

  return (
    <div className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden mb-2 bg-gray-100 border border-gray-200" style={{ aspectRatio: "3/4" }}>
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-center">
            <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <span className="text-[10px] font-semibold text-slate-500">{item.title}</span>
          </div>
        )}

        {/* Favorite */}
        <button onClick={handleFavorite}
          className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${favorited ? "bg-red-500 scale-110" : "bg-black/20 backdrop-blur-sm hover:bg-black/40"}`}>
          <svg width="11" height="11" fill={favorited ? "white" : "none"} stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* PDF badge */}
        <div className="absolute top-2 right-2">
          <span className="text-[9px] font-bold bg-red-500 text-white rounded px-1.5 py-0.5">PDF</span>
        </div>

        {/* Download overlay */}
        <button onClick={handleDownload} disabled={loading}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/30">
          <div className="bg-white text-black text-[12px] font-semibold px-4 py-2 rounded-xl shadow">
            {loading ? "..." : "↓ Download"}
          </div>
        </button>
      </div>

      <p className="text-[11.5px] font-medium text-gray-800 truncate">{item.title}</p>
      {item.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-0.5">
          {item.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[9.5px] text-gray-400 capitalize">{t.replace(/-/g, " ")}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AssetGrid({
  items,
  nicheColors,
}: {
  items: ContentItem[]
  nicheColors: Record<string, string>
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {items.map(item =>
        item.type === "ebook"
          ? <EbookCard key={item.id} item={item} />
          : <VideoCard key={item.id} item={item} nicheColor={nicheColors[item.niche] ?? "#94a3b8"} />
      )}
    </div>
  )
}
