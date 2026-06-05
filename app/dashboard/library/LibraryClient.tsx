"use client"

import { useState, useCallback, useRef } from "react"

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

// ─── helpers ────────────────────────────────────────────────────────────────

const NICHE_COLOR: Record<string, string> = {
  luxury: "#c9a96e", fitness: "#4ade80", travel: "#38bdf8", gaming: "#a78bfa",
  "digital-marketing": "#fb923c", nature: "#86efac", satisfying: "#f9a8d4",
  backgrounds: "#94a3b8", "money-trading": "#fbbf24", automotive: "#f87171",
  "real-estate": "#6ee7b7", motivation: "#fcd34d",
}

function fmtSize(bytes: number | null) {
  if (!bytes) return ""
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`
  if (bytes >= 1_048_576)     return `${(bytes / 1_048_576).toFixed(0)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

function fmtDuration(s: number | null) {
  if (!s) return ""
  const m = Math.floor(s / 60), sec = s % 60
  return m > 0 ? `${m}:${String(sec).padStart(2, "0")}` : `${s}s`
}

// ─── Download engine ─────────────────────────────────────────────────────────

async function downloadBlob(url: string, filename: string): Promise<void> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const blob = await res.blob()
  const objUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = objUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(objUrl), 100)
}

function makeFilename(title: string, type: string) {
  return title.replace(/[^a-zA-Z0-9 ]/g, "").trim() + (type === "ebook" ? ".pdf" : ".mp4")
}

async function downloadWithRetry(
  id: string, filename: string, initialUrl: string
): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      let url = initialUrl
      if (attempt > 0) {
        const r = await fetch(`/api/content/${id}/download`)
        const j = await r.json()
        url = j.url
      }
      if (!url) continue
      await downloadBlob(url, filename)
      return true
    } catch {
      if (attempt < 2) await new Promise(r => setTimeout(r, 1500 * (attempt + 1)))
    }
  }
  return false
}

async function runQueue(
  allIds: string[],
  onProgress: (done: number, failed: number) => void,
  cancelRef: React.MutableRefObject<boolean>
) {
  const BATCH = 20
  const CONCURRENCY = 3
  let done = 0, failed = 0

  for (let b = 0; b < allIds.length; b += BATCH) {
    if (cancelRef.current) return

    const batchIds = allIds.slice(b, b + BATCH)
    const res = await fetch("/api/content/batch-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: batchIds }),
    })
    const { urls } = await res.json() as {
      urls: { id: string; url: string; title: string; type: string }[]
    }

    const pending = [...urls]
    const worker = async () => {
      while (pending.length > 0 && !cancelRef.current) {
        const item = pending.shift()!
        const ok = await downloadWithRetry(item.id, makeFilename(item.title, item.type), item.url)
        ok ? done++ : failed++
        onProgress(done, failed)
        await new Promise(r => setTimeout(r, 80))
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker)
    )
  }
}

// ─── Card ────────────────────────────────────────────────────────────────────

function AssetCard({
  item, selecting, selected, onToggle,
}: {
  item: ContentItem
  selecting: boolean
  selected: boolean
  onToggle: (id: string) => void
}) {
  const [loading, setLoading]     = useState(false)
  const [favorited, setFavorited] = useState(false)
  const color   = NICHE_COLOR[item.niche] ?? "#94a3b8"
  const isEbook = item.type === "ebook"

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selecting) return
    setLoading(true)
    try {
      const res = await fetch(`/api/content/${item.id}/download`)
      const { url } = await res.json()
      if (url) window.open(url, "_blank")
    } finally { setLoading(false) }
  }

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const res = await fetch(`/api/content/${item.id}/favorite`, { method: "POST" })
    const { favorited: f } = await res.json()
    setFavorited(f)
  }

  return (
    <div
      className={`group cursor-pointer relative ${selecting ? "cursor-pointer" : ""}`}
      onClick={() => selecting && onToggle(item.id)}
    >
      <div
        className={`relative rounded-xl overflow-hidden mb-2 transition-all ${selected ? "ring-2 ring-black ring-offset-2" : ""}`}
        style={{ aspectRatio: isEbook ? "3/4" : "9/16" }}
      >
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3"
            style={{ background: `linear-gradient(135deg, ${color}18, ${color}35)` }}>
            {isEbook ? (
              <svg width="22" height="22" fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
            <span className="text-[9px] font-bold uppercase tracking-widest text-center leading-tight" style={{ color }}>
              {item.niche.replace(/-/g, " ")}
            </span>
          </div>
        )}

        {/* Select checkbox */}
        {selecting && (
          <div className={`absolute top-2 left-2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selected ? "bg-black border-black" : "bg-white/80 border-gray-400"}`}>
            {selected && <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
        )}

        {/* Favorite */}
        {!selecting && (
          <button onClick={handleFavorite}
            className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all ${favorited ? "bg-red-500 opacity-100" : "bg-black/30 backdrop-blur-sm hover:bg-black/50"}`}>
            <svg width="9" height="9" fill={favorited ? "white" : "none"} stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        )}

        {/* Badges */}
        {!selecting && (
          <>
            {item.durationSeconds ? (
              <div className="absolute bottom-2 right-2">
                <span className="text-[9px] font-bold text-white bg-black/70 rounded px-1.5 py-0.5">{fmtDuration(item.durationSeconds)}</span>
              </div>
            ) : null}
            {isEbook && (
              <div className="absolute top-2 right-2">
                <span className="text-[9px] font-bold bg-red-500 text-white rounded px-1.5 py-0.5">PDF</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              <span className="text-[9px] font-bold text-white uppercase tracking-wide bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 capitalize">
                {item.niche.replace(/-/g, " ")}
              </span>
            </div>
          </>
        )}

        {/* Download overlay */}
        {!selecting && (
          <button onClick={handleDownload} disabled={loading}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40">
            <div className="bg-white text-black text-[12px] font-semibold px-4 py-2 rounded-xl shadow">
              {loading ? "..." : "↓ Download"}
            </div>
          </button>
        )}
      </div>

      <p className="text-[11px] font-medium text-gray-800 truncate">{item.title}</p>
      {isEbook && item.tags.length > 0 ? (
        <p className="text-[10px] text-gray-400 capitalize">{item.tags.slice(0, 2).join(" · ")}</p>
      ) : (
        <p className="text-[10px] text-gray-400">{fmtSize(item.fileSizeBytes)}</p>
      )}
    </div>
  )
}

// ─── Download progress overlay ───────────────────────────────────────────────

interface DlState { done: number; failed: number; total: number; active: boolean }

function DownloadProgress({
  state, onClose, onCancel,
}: {
  state: DlState
  onClose: () => void
  onCancel: () => void
}) {
  const { done, failed, total, active } = state
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0
  const finished = done + failed >= total && !active

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-2xl px-6 py-4 shadow-2xl min-w-[360px] max-w-[480px]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[13px] font-semibold">
            {finished
              ? `Done — ${done.toLocaleString()} downloaded`
              : `Downloading ${(done + failed).toLocaleString()} / ${total.toLocaleString()}`}
          </span>
          {failed > 0 && (
            <span className="text-[11px] text-red-400 ml-2">{failed} failed</span>
          )}
        </div>
        {finished ? (
          <button onClick={onClose} className="text-[12px] text-gray-400 hover:text-white ml-4">✕</button>
        ) : (
          <button onClick={onCancel} className="text-[12px] text-gray-400 hover:text-red-400 ml-4 transition-colors">Cancel</button>
        )}
      </div>
      <div className="w-full bg-white/20 rounded-full h-1.5 mb-1.5">
        <div className="bg-white rounded-full h-1.5 transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] text-gray-400">
        {finished
          ? (failed > 0 ? `${failed} file(s) could not be downloaded after 3 attempts.` : "All files downloaded successfully!")
          : `${pct}% complete — keep this tab open`}
      </p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LibraryClient({
  items,
  total,
  page,
  take,
  niches,
  allTags,
  filters,
}: {
  items: ContentItem[]
  total: number
  page: number
  take: number
  niches: string[]
  allTags: string[]
  filters: { niche?: string; type?: string; tag?: string; q?: string }
}) {
  const { niche, type, tag, q } = filters

  const [selecting, setSelecting] = useState(false)
  const [selected, setSelected]   = useState<Set<string>>(new Set())
  const [dlState, setDlState]     = useState<DlState | null>(null)
  const [dlLoading, setDlLoading] = useState(false)
  const cancelRef                 = useRef(false)

  const totalPages = Math.ceil(total / take)

  function href(updates: Record<string, string | undefined>) {
    const p = new URLSearchParams()
    const m = { niche, type, tag, q, page: "1", ...updates }
    Object.entries(m).forEach(([k, v]) => { if (v && v !== "all") p.set(k, v) })
    const s = p.toString()
    return `/dashboard/library${s ? `?${s}` : ""}`
  }

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const selectAll = () => setSelected(new Set(items.map(i => i.id)))
  const clearAll  = () => { setSelected(new Set()); setSelecting(false) }

  // ─── Download selected items ───────────────────────────────────────────────
  const downloadSelected = async (ids: string[]) => {
    cancelRef.current = false
    setDlState({ done: 0, failed: 0, total: ids.length, active: true })
    await runQueue(ids, (done, failed) => {
      setDlState({ done, failed, total: ids.length, active: true })
    }, cancelRef)
    setDlState(prev => prev ? { ...prev, active: false } : null)
  }

  // ─── Download all matching filter ─────────────────────────────────────────
  const downloadAll = async () => {
    setDlLoading(true)
    try {
      const params = new URLSearchParams()
      if (niche) params.set("niche", niche)
      if (type)  params.set("type",  type)
      if (tag)   params.set("tag",   tag)
      if (q)     params.set("q",     q)

      const res = await fetch(`/api/content/ids?${params}`)
      const { ids } = await res.json() as { ids: string[] }
      if (!ids?.length) return

      cancelRef.current = false
      setDlState({ done: 0, failed: 0, total: ids.length, active: true })
      await runQueue(ids, (done, failed) => {
        setDlState({ done, failed, total: ids.length, active: true })
      }, cancelRef)
      setDlState(prev => prev ? { ...prev, active: false } : null)
    } finally {
      setDlLoading(false)
    }
  }

  const cancelDownload = () => {
    cancelRef.current = true
    setDlState(prev => prev ? { ...prev, active: false } : null)
  }

  const typeLabel = type === "ebook" ? "ebooks" : "clips"

  return (
    <div className="max-w-[1300px] mx-auto px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-black text-black leading-tight">
          Browse the library.{" "}
          <span className="font-light italic text-gray-400">Drop straight into your launch.</span>
        </h1>
      </div>

      {/* Horizontal type tabs — overflow-x-auto for easy future expansion */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-100 pb-0 overflow-x-auto">
        {[
          { label: "All",    val: undefined },
          { label: "Clips",  val: "video"   },
          { label: "Ebooks", val: "ebook"   },
        ].map(({ label, val }) => {
          const active = type === val || (!type && !val)
          return (
            <a key={label} href={href({ type: val })}
              className={`px-4 py-2.5 text-[13.5px] font-semibold border-b-2 transition-colors -mb-px whitespace-nowrap ${
                active ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"
              }`}>
              {label}
            </a>
          )
        })}
      </div>

      {/* Filter + action bar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {/* Niche filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <a href={href({ niche: undefined })}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors ${!niche ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
            All
          </a>
          {niches.map(n => (
            <a key={n} href={href({ niche: n })}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors capitalize ${niche === n ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
              {n.replace(/-/g, " ")}
            </a>
          ))}
        </div>

        {/* Search */}
        <form method="GET" action="/dashboard/library" className="ml-auto flex items-center border border-gray-200 rounded-xl px-3 py-2 gap-2 bg-white focus-within:ring-2 focus-within:ring-black transition-all">
          {niche && <input type="hidden" name="niche" value={niche} />}
          {type  && <input type="hidden" name="type"  value={type}  />}
          {tag   && <input type="hidden" name="tag"   value={tag}   />}
          <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input name="q" defaultValue={q ?? ""} placeholder="Search…" className="text-[13px] outline-none w-40 bg-transparent" />
        </form>

        {/* Select toggle */}
        <button
          onClick={() => { setSelecting(!selecting); setSelected(new Set()) }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold border transition-colors ${selecting ? "bg-black text-white border-black" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          {selecting ? "Cancel" : "Select"}
        </button>
      </div>

      {/* Tag filters for ebooks */}
      {type === "ebook" && allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Filter by topic:</span>
          {tag && <a href={href({ tag: undefined })} className="px-3 py-1 rounded-full text-[11.5px] font-semibold bg-black text-white">✕ {tag}</a>}
          {allTags.filter(t => t !== tag).map(t => (
            <a key={t} href={href({ tag: t })}
              className="px-3 py-1 rounded-full text-[11.5px] font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 capitalize transition-colors">
              {t.replace(/-/g, " ")}
            </a>
          ))}
        </div>
      )}

      {/* Select mode action bar */}
      {selecting && (
        <div className="flex items-center gap-3 mb-5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
          <span className="text-[13px] font-semibold text-gray-700">{selected.size} selected</span>
          <button onClick={selectAll} className="text-[12px] text-gray-500 hover:text-black underline">Select all on page</button>
          <button onClick={clearAll}  className="text-[12px] text-gray-500 hover:text-black underline">Clear</button>
          {selected.size > 0 && (
            <div className="ml-auto">
              <button
                onClick={() => downloadSelected([...selected])}
                className="flex items-center gap-2 bg-black text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download {selected.size} {selected.size === 1 ? "file" : "files"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Count + Download All */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-gray-500">
          {total.toLocaleString()} {typeLabel}
        </p>
        {!selecting && total > 0 && (
          <button
            onClick={downloadAll}
            disabled={dlLoading || dlState?.active}
            className="flex items-center gap-2 bg-black text-white text-[12.5px] font-semibold px-4 py-2 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {dlLoading ? "Preparing…" : `Download all ${total.toLocaleString()} ${typeLabel}`}
          </button>
        )}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="text-center py-24 border border-gray-100 rounded-2xl">
          <p className="text-[18px] font-semibold text-gray-500 mb-2">No results</p>
          <p className="text-[14px] text-gray-400">Try a different filter or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {items.map(item => (
            <AssetCard
              key={item.id}
              item={item}
              selecting={selecting}
              selected={selected.has(item.id)}
              onToggle={toggleSelect}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          {page > 1 && (
            <a href={href({ page: String(page - 1) })} className="px-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium hover:border-gray-400 transition-colors">← Previous</a>
          )}
          <span className="text-[13px] text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <a href={href({ page: String(page + 1) })} className="px-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium hover:border-gray-400 transition-colors">Next →</a>
          )}
        </div>
      )}

      {/* Download progress overlay */}
      {dlState && (
        <DownloadProgress
          state={dlState}
          onClose={() => setDlState(null)}
          onCancel={cancelDownload}
        />
      )}
    </div>
  )
}
