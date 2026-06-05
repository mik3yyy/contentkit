"use client"

import { useState, useCallback, useRef, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

function cleanTitle(t: string) {
  return t.replace(/#\S+/g, "").replace(/\s+/g, " ").trim()
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
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

// ─── Download engine ─────────────────────────────────────────────────────────

async function downloadBlob(url: string, filename: string): Promise<void> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const blob = await res.blob()
  const objUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = objUrl; a.download = filename
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(objUrl), 100)
}
function makeFilename(title: string, type: string) {
  return cleanTitle(title).replace(/[^a-zA-Z0-9 ]/g, "").trim() + (type === "ebook" ? ".pdf" : ".mp4")
}
async function downloadWithRetry(id: string, filename: string, initialUrl: string): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      let url = initialUrl
      if (attempt > 0) { const r = await fetch(`/api/content/${id}/download`); url = (await r.json()).url }
      if (!url) continue
      await downloadBlob(url, filename)
      return true
    } catch { if (attempt < 2) await new Promise(r => setTimeout(r, 1500 * (attempt + 1))) }
  }
  return false
}
async function runQueue(allIds: string[], onProgress: (d: number, f: number) => void, cancelRef: React.MutableRefObject<boolean>) {
  const BATCH = 20, CONCURRENCY = 3; let done = 0, failed = 0
  for (let b = 0; b < allIds.length; b += BATCH) {
    if (cancelRef.current) return
    const batchIds = allIds.slice(b, b + BATCH)
    const { urls } = await fetch("/api/content/batch-download", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: batchIds }) }).then(r => r.json()) as { urls: { id: string; url: string; title: string; type: string }[] }
    const pending = [...urls]
    const worker = async () => {
      while (pending.length > 0 && !cancelRef.current) {
        const item = pending.shift()!
        const ok = await downloadWithRetry(item.id, makeFilename(item.title, item.type), item.url)
        ok ? done++ : failed++; onProgress(done, failed); await new Promise(r => setTimeout(r, 80))
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker))
  }
}

// ─── Card ────────────────────────────────────────────────────────────────────

function AssetCard({
  item, selecting, selected, onToggle, previewUrl,
}: {
  item: ContentItem; selecting: boolean; selected: boolean
  onToggle: (id: string) => void; previewUrl: string | undefined
}) {
  const [favorited, setFavorited]   = useState(false)
  const [frameReady, setFrameReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const title    = cleanTitle(item.title)
  const isEbook  = item.type === "ebook"
  const tier     = item.tags[0]?.toUpperCase()

  useEffect(() => {
    const v = videoRef.current
    if (!v || !previewUrl || isEbook) return
    const onMeta   = () => { v.currentTime = 1 }
    const onSeeked = () => setFrameReady(true)
    v.addEventListener("loadedmetadata", onMeta)
    v.addEventListener("seeked",         onSeeked)
    if (v.readyState >= 1) v.currentTime = 1
    return () => {
      v.removeEventListener("loadedmetadata", onMeta)
      v.removeEventListener("seeked",         onSeeked)
    }
  }, [previewUrl, isEbook])

  const handleMouseEnter = () => { if (videoRef.current && !isEbook) videoRef.current.play().catch(() => {}) }
  const handleMouseLeave = () => { if (videoRef.current) videoRef.current.pause() }

  const stopAndFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const { favorited: f } = await fetch(`/api/content/${item.id}/favorite`, { method: "POST" }).then(r => r.json())
    setFavorited(f)
  }

  const thumbnail = (
    <div
      className={`relative rounded-xl overflow-hidden mb-2 ${selected ? "ring-2 ring-black ring-offset-2" : ""}`}
      style={{ aspectRatio: isEbook ? "3/4" : "9/16" }}
    >
      {item.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.thumbnailUrl} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          {isEbook
            ? <svg width="24" height="24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            : <svg width="24" height="24" fill="rgba(255,255,255,0.18)" stroke="none" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
        </div>
      )}

      {previewUrl && !isEbook && (
        <video
          ref={videoRef}
          src={previewUrl}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${frameReady ? "opacity-100" : "opacity-0"}`}
          preload="metadata"
          muted
          playsInline
        />
      )}

      {selecting && (
        <div className={`absolute top-2 left-2 w-5 h-5 rounded-md border-2 flex items-center justify-center z-10 ${selected ? "bg-black border-black" : "bg-white/80 border-gray-400"}`}>
          {selected && <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
      )}

      {!selecting && (
        <>
          {tier && (
            <div className="absolute top-2 left-2 z-10">
              <span className="text-[8px] font-black tracking-widest text-white bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 uppercase">{tier}</span>
            </div>
          )}
          <button onClick={stopAndFavorite}
            className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity ${favorited ? "bg-red-500 !opacity-100" : "bg-black/30 backdrop-blur-sm hover:bg-black/50"}`}>
            <svg width="9" height="9" fill={favorited ? "white" : "none"} stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          {item.durationSeconds && (
            <div className="absolute bottom-2 right-2 z-10">
              <span className="text-[9px] font-bold text-white bg-black/70 rounded px-1.5 py-0.5">{fmtDuration(item.durationSeconds)}</span>
            </div>
          )}
          {isEbook && (
            <>
              <div className="absolute bottom-2 left-2 z-10">
                <span className="text-[9px] font-bold text-white uppercase tracking-wide bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 capitalize">
                  {item.niche.replace(/-/g, " ")}
                </span>
              </div>
              {!tier && (
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-[9px] font-bold bg-red-500 text-white rounded px-1.5 py-0.5">PDF</span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )

  // Videos: duration only. Ebooks: title + tags.
  const meta = isEbook ? (
    <>
      <p className="text-[11px] font-medium text-gray-800 truncate">{title}</p>
      {item.tags.length > 1 && <p className="text-[10px] text-gray-400 capitalize">{item.tags.slice(1, 3).join(" · ")}</p>}
    </>
  ) : (
    <p className="text-[10px] text-gray-400">{fmtDuration(item.durationSeconds) || fmtSize(item.fileSizeBytes)}</p>
  )

  if (selecting) {
    return <div className="group cursor-pointer" onClick={() => onToggle(item.id)}>{thumbnail}{meta}</div>
  }
  return (
    <Link href={`/dashboard/library/${item.id}`} className="group block"
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {thumbnail}{meta}
    </Link>
  )
}

// ─── Grid shimmer ────────────────────────────────────────────────────────────

function GridShimmer({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="shimmer rounded-xl mb-2" style={{ aspectRatio: "9/16" }} />
          <div className="shimmer h-2.5 rounded w-1/3" />
        </div>
      ))}
    </div>
  )
}

// ─── Download progress ───────────────────────────────────────────────────────

interface DlState { done: number; failed: number; total: number; active: boolean }

function DownloadProgress({ state, onClose, onCancel }: { state: DlState; onClose: () => void; onCancel: () => void }) {
  const { done, failed, total, active } = state
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const finished = done + failed >= total && !active
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-2xl px-6 py-4 shadow-2xl min-w-[360px]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[13px] font-semibold">
            {finished ? `Done — ${done.toLocaleString()} downloaded` : `Downloading ${(done + failed).toLocaleString()} / ${total.toLocaleString()}`}
          </span>
          {failed > 0 && <span className="text-[11px] text-red-400 ml-2">{failed} failed</span>}
        </div>
        {finished
          ? <button onClick={onClose} className="text-[12px] text-gray-400 hover:text-white ml-4">✕</button>
          : <button onClick={onCancel} className="text-[12px] text-gray-400 hover:text-red-400 ml-4">Cancel</button>}
      </div>
      <div className="w-full bg-white/20 rounded-full h-1.5 mb-1.5">
        <div className="bg-white rounded-full h-1.5 transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] text-gray-400">
        {finished ? (failed > 0 ? `${failed} file(s) could not be downloaded.` : "All files downloaded!") : `${pct}% complete — keep this tab open`}
      </p>
    </div>
  )
}

// ─── Tabs — no "All" ─────────────────────────────────────────────────────────

const TYPE_TABS = [
  { label: "Clips",       val: "video"       },
  { label: "Ebooks",      val: "ebook"       },
  { label: "Guides",      val: "guide"       },
  { label: "Templates",   val: "template"    },
  { label: "Prompts",     val: "prompt"      },
  { label: "Tools",       val: "tool"        },
  { label: "Presets",     val: "preset"      },
  { label: "Audio",       val: "audio"       },
  { label: "Clip picker", val: "clip-picker" },
]

// ─── Main component ───────────────────────────────────────────────────────────

export default function LibraryClient({
  items, total, page, take, niches, allTags, filters,
}: {
  items: ContentItem[]; total: number; page: number; take: number
  niches: string[]; allTags: string[]
  filters: { niche?: string; type?: string; tag?: string; q?: string }
}) {
  const { niche, type, tag, q } = filters
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [selecting, setSelecting]     = useState(false)
  const [selected, setSelected]       = useState<Set<string>>(new Set())
  const [dlState, setDlState]         = useState<DlState | null>(null)
  const [dlLoading, setDlLoading]     = useState(false)
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const [searchVal, setSearchVal]     = useState(q ?? "")
  const cancelRef                     = useRef(false)

  // Batch-fetch preview URLs for video items on this page
  useEffect(() => {
    const videoIds = items.filter(i => i.type === "video").map(i => i.id)
    if (!videoIds.length) return
    fetch("/api/content/batch-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: videoIds }),
    })
      .then(r => r.json())
      .then(({ urls }: { urls: { id: string; url: string }[] }) => {
        const map: Record<string, string> = {}
        urls?.forEach(u => { map[u.id] = u.url })
        setPreviewUrls(map)
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map(i => i.id).join(",")])

  // Keep search input in sync with URL
  useEffect(() => { setSearchVal(q ?? "") }, [q])

  const totalPages = Math.ceil(total / take)
  const typeLabel  = type === "ebook" ? "ebooks" : type === "video" ? "clips" : type ?? "items"

  // Build URL string
  function href(updates: Record<string, string | undefined>) {
    const p = new URLSearchParams()
    const m: Record<string, string | undefined> = { niche, type, tag, q, page: "1", ...updates }
    Object.entries(m).forEach(([k, v]) => { if (v) p.set(k, v) })
    const s = p.toString()
    return `/dashboard/library${s ? `?${s}` : ""}`
  }

  // Navigate using startTransition — only the grid shimmers, header stays
  const go = (url: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    startTransition(() => router.push(url))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => router.push(href({ q: searchVal || undefined, page: "1" })))
  }

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])
  const selectAll = () => setSelected(new Set(items.map(i => i.id)))
  const clearAll  = () => { setSelected(new Set()); setSelecting(false) }

  const downloadSelected = async (ids: string[]) => {
    cancelRef.current = false
    setDlState({ done: 0, failed: 0, total: ids.length, active: true })
    await runQueue(ids, (done, failed) => setDlState({ done, failed, total: ids.length, active: true }), cancelRef)
    setDlState(prev => prev ? { ...prev, active: false } : null)
  }
  const downloadAll = async () => {
    setDlLoading(true)
    try {
      const params = new URLSearchParams()
      if (niche) params.set("niche", niche); if (type) params.set("type", type)
      if (tag)   params.set("tag",   tag);   if (q)    params.set("q",    q)
      const { ids } = await fetch(`/api/content/ids?${params}`).then(r => r.json()) as { ids: string[] }
      if (!ids?.length) return
      cancelRef.current = false
      setDlState({ done: 0, failed: 0, total: ids.length, active: true })
      await runQueue(ids, (done, failed) => setDlState({ done, failed, total: ids.length, active: true }), cancelRef)
      setDlState(prev => prev ? { ...prev, active: false } : null)
    } finally { setDlLoading(false) }
  }
  const cancelDownload = () => { cancelRef.current = true; setDlState(prev => prev ? { ...prev, active: false } : null) }

  return (
    <div className="max-w-[1300px] mx-auto px-8 py-8">

      {/* Heading — larger */}
      <div className="mb-10">
        <h1 className="text-[46px] font-black text-black leading-tight tracking-tight">
          Browse the library.{" "}
          <span className="font-light italic text-gray-400">Drop straight into your launch.</span>
        </h1>
      </div>

      {/* Type tabs — no "All", Clips is first/default */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-100 pb-0 overflow-x-auto">
        {TYPE_TABS.map(({ label, val }) => {
          const tabUrl = href({ type: val, niche: undefined, tag: undefined, page: "1" })
          const active = type === val
          return (
            <a key={val} href={tabUrl} onClick={go(tabUrl)}
              className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors -mb-px whitespace-nowrap ${
                active ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}>
              {label}
            </a>
          )
        })}
      </div>

      {/* Filter bar — stable during transitions */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* "All niches" pill */}
          {(() => {
            const url = href({ niche: undefined, page: "1" })
            return (
              <a href={url} onClick={go(url)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors ${!niche ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                All
              </a>
            )
          })()}
          {niches.map(n => {
            const url = href({ niche: n, page: "1" })
            return (
              <a key={n} href={url} onClick={go(url)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors capitalize ${niche === n ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                {n.replace(/-/g, " ")}
              </a>
            )
          })}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="ml-auto flex items-center border border-gray-200 rounded-xl px-3 py-2 gap-2 bg-white focus-within:ring-2 focus-within:ring-black transition-all">
          <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search…"
            className="text-[13px] outline-none w-40 bg-transparent"
          />
        </form>

        <button onClick={() => { setSelecting(!selecting); setSelected(new Set()) }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold border transition-colors ${selecting ? "bg-black text-white border-black" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          {selecting ? "Cancel" : "Select"}
        </button>
      </div>

      {/* Tag filters — ebooks only */}
      {type === "ebook" && allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Filter by topic:</span>
          {tag && (() => {
            const url = href({ tag: undefined })
            return <a href={url} onClick={go(url)} className="px-3 py-1 rounded-full text-[11.5px] font-semibold bg-black text-white">✕ {tag}</a>
          })()}
          {allTags.filter(t => t !== tag).map(t => {
            const url = href({ tag: t })
            return (
              <a key={t} href={url} onClick={go(url)}
                className="px-3 py-1 rounded-full text-[11.5px] font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 capitalize transition-colors">
                {t.replace(/-/g, " ")}
              </a>
            )
          })}
        </div>
      )}

      {/* Select mode bar */}
      {selecting && (
        <div className="flex items-center gap-3 mb-5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
          <span className="text-[13px] font-semibold text-gray-700">{selected.size} selected</span>
          <button onClick={selectAll} className="text-[12px] text-gray-500 hover:text-black underline">Select all on page</button>
          <button onClick={clearAll}  className="text-[12px] text-gray-500 hover:text-black underline">Clear</button>
          {selected.size > 0 && (
            <div className="ml-auto">
              <button onClick={() => downloadSelected([...selected])}
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

      {/* ─── Content area: ONLY this part shimmers on filter change ─────── */}

      {/* Count + Download All */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-gray-500">
          {isPending ? "Loading…" : `${total.toLocaleString()} ${typeLabel}`}
        </p>
        {!selecting && total > 0 && !isPending && (
          <button onClick={downloadAll} disabled={dlLoading || dlState?.active}
            className="flex items-center gap-2 bg-black text-white text-[12.5px] font-semibold px-4 py-2 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {dlLoading ? "Preparing…" : `Download all ${total.toLocaleString()} ${typeLabel}`}
          </button>
        )}
      </div>

      {/* Grid — shimmer replaces content during filter transitions */}
      {isPending ? (
        <GridShimmer count={10} />
      ) : items.length === 0 ? (
        <div className="text-center py-24 border border-gray-100 rounded-2xl">
          <p className="text-[18px] font-semibold text-gray-500 mb-2">No results</p>
          <p className="text-[14px] text-gray-400">Try a different filter or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map(item => (
            <AssetCard
              key={item.id}
              item={item}
              selecting={selecting}
              selected={selected.has(item.id)}
              onToggle={toggleSelect}
              previewUrl={previewUrls[item.id]}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isPending && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          {page > 1 && (() => { const url = href({ page: String(page - 1) }); return <a href={url} onClick={go(url)} className="px-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium hover:border-gray-400 transition-colors">← Previous</a> })()}
          <span className="text-[13px] text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && (() => { const url = href({ page: String(page + 1) }); return <a href={url} onClick={go(url)} className="px-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium hover:border-gray-400 transition-colors">Next →</a> })()}
        </div>
      )}

      {dlState && <DownloadProgress state={dlState} onClose={() => setDlState(null)} onCancel={cancelDownload} />}
    </div>
  )
}
