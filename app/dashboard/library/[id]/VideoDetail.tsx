"use client"

import { useState } from "react"
import Link from "next/link"

interface Item {
  id: string; title: string; type: string; niche: string
  thumbnailUrl: string | null; fileSizeBytes: number | null
  durationSeconds: number | null; tags: string[]
}

interface SmallItem {
  id: string; title: string; type: string; niche: string
  thumbnailUrl: string | null; durationSeconds: number | null; tags: string[]
}

// ─── helpers ────────────────────────────────────────────────────────────────

function cleanTitle(t: string) {
  return t.replace(/#\S+/g, "").replace(/\s+/g, " ").trim()
}
function fmtSize(b: number | null) {
  if (!b) return ""
  if (b >= 1_073_741_824) return `${(b / 1_073_741_824).toFixed(1)} GB`
  if (b >= 1_048_576)     return `${(b / 1_048_576).toFixed(0)} MB`
  return `${(b / 1024).toFixed(0)} KB`
}
function fmtDuration(s: number | null) {
  if (!s) return ""
  const m = Math.floor(s / 60), sec = s % 60
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}
function capitalize(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
}

// ─── Static content ──────────────────────────────────────────────────────────

const USE_CASES = [
  {
    icon: "reel",
    title: "Drop into a faceless reel",
    desc: "Post 2–3 times/week to grow a niche page. Caption with a hook + soft CTA to your link in bio.",
  },
  {
    icon: "ad",
    title: "Open or close an ad creative",
    desc: "Use the first 1–2 seconds as the pattern interrupt. Pair with a punchy headline overlay.",
  },
  {
    icon: "magnet",
    title: "Background for a lead magnet teaser",
    desc: "Stack with text-on-video to promote a freebie. Send traffic to your opt-in.",
  },
  {
    icon: "story",
    title: "Story background for an offer",
    desc: "Loop in IG/TikTok stories with sticker CTAs. Drives DMs and warm leads to a paid product.",
  },
]

const FAQ = [
  {
    q: "Can I edit and resell this clip?",
    a: "Yes. Drop into your editor, recut, caption, brand it. Use in your reels, ads, products, client work. Keep all revenue.",
  },
  {
    q: "What's the license?",
    a: "Commercial use, perpetual, no attribution required. Use in ads, products, client deliverables — your call.",
  },
  {
    q: "What format is it?",
    a: "Stream-ready 9:16 footage at HD or higher. Download the source file, drop into any editor, no transcoding needed.",
  },
  {
    q: "Will this work for my niche?",
    a: "If your audience overlaps with the category above, yes. Pair with hooks and captions that match your brand voice.",
  },
]

function UseCaseIcon({ name }: { name: string }) {
  const p = { width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.5, viewBox: "0 0 24 24" }
  switch (name) {
    case "reel":   return <svg {...p}><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
    case "ad":     return <svg {...p}><polyline points="15 3 21 3 21 9"/><path d="M10 14L21 3"/><path d="M21 16v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
    case "magnet": return <svg {...p}><path d="M18 2a2 2 0 0 1 2 2v10a8 8 0 0 1-16 0V4a2 2 0 0 1 2-2"/><line x1="12" y1="10" x2="12" y2="14"/></svg>
    case "story":  return <svg {...p}><path d="M21 2H3v16h5l3 3 3-3h7V2z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="14" x2="12" y2="14"/></svg>
    default: return null
  }
}

// ─── Small card for horizontal scroll sections ────────────────────────────────

function SmallCard({ item }: { item: SmallItem }) {
  const title = cleanTitle(item.title)
  const color  = "#94a3b8"
  return (
    <Link href={`/dashboard/library/${item.id}`} className="group block w-[130px] flex-shrink-0">
      <div className="relative rounded-xl overflow-hidden mb-1.5 bg-gray-100" style={{ aspectRatio: "9/16" }}>
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}18, ${color}35)` }}>
            <svg width="18" height="18" fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        )}
        {item.durationSeconds && (
          <span className="absolute bottom-1.5 right-1.5 text-[8px] font-bold text-white bg-black/70 rounded px-1 py-0.5">
            {fmtDuration(item.durationSeconds)}
          </span>
        )}
      </div>
      <p className="text-[11px] font-medium text-gray-800 truncate">{title}</p>
      {item.durationSeconds && (
        <p className="text-[10px] text-gray-400">{fmtDuration(item.durationSeconds)}</p>
      )}
    </Link>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VideoDetail({
  item,
  packItems,
  relatedItems,
  previewUrl,
}: {
  item: Item
  packItems: SmallItem[]
  relatedItems: SmallItem[]
  previewUrl: string | null
}) {
  const [downloading, setDownloading] = useState(false)
  const [favorited, setFavorited]     = useState(false)

  const title      = cleanTitle(item.title)
  const nicheLabel = capitalize(item.niche)
  const isVideo    = item.type === "video"

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await fetch(`/api/content/${item.id}/download`)
      const { url } = await res.json()
      if (url) window.open(url, "_blank")
    } finally { setDownloading(false) }
  }

  const handleFavorite = async () => {
    const res = await fetch(`/api/content/${item.id}/favorite`, { method: "POST" })
    const { favorited: f } = await res.json()
    setFavorited(f)
  }

  const backType = isVideo ? "video" : item.type

  return (
    <div className="bg-white min-h-screen">

      {/* Breadcrumb nav */}
      <div className="px-8 py-3 border-b border-gray-100 bg-white">
        <nav className="flex items-center gap-2 text-[12px] text-gray-500">
          <Link href={`/dashboard/library?type=${backType}`}
            className="hover:text-black transition-colors uppercase tracking-wider font-semibold">
            ← {isVideo ? "Clips" : capitalize(item.type) + "s"}
          </Link>
          <span className="text-gray-300">/</span>
          <Link href={`/dashboard/library?niche=${item.niche}&type=${backType}`}
            className="hover:text-black transition-colors capitalize">
            {item.niche.replace(/-/g, " ")}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400 truncate max-w-[200px]">{title}</span>
        </nav>
      </div>

      {/* Hero: video left + metadata right */}
      <div className="flex">

        {/* Left panel: video / thumbnail */}
        <div className="w-[40%] flex-shrink-0 bg-black flex flex-col" style={{ minHeight: "540px" }}>
          <div className="flex-1 relative">
            {isVideo && previewUrl ? (
              <video
                src={previewUrl}
                className="w-full h-full object-contain"
                style={{ minHeight: "460px", maxHeight: "calc(100vh - 160px)" }}
                controls
                preload="metadata"
                playsInline
              />
            ) : item.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.thumbnailUrl}
                alt={title}
                className="w-full object-contain"
                style={{ height: "460px" }}
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-900" style={{ height: "460px" }}>
                <svg width="48" height="48" fill="none" stroke="#4b5563" strokeWidth="1" viewBox="0 0 24 24">
                  {isVideo
                    ? <polygon points="5 3 19 12 5 21 5 3"/>
                    : <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>}
                </svg>
              </div>
            )}
          </div>

          {/* Stats footer */}
          <div className="flex items-center gap-5 px-6 py-3 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              HD
            </span>
            {isVideo && <span className="text-[11px] text-gray-400">9:16</span>}
            {item.durationSeconds && <span className="text-[11px] text-gray-400">{fmtDuration(item.durationSeconds)}</span>}
            {item.fileSizeBytes && <span className="text-[11px] text-gray-400">{fmtSize(item.fileSizeBytes)}</span>}
          </div>
        </div>

        {/* Right panel: metadata */}
        <div className="flex-1 px-10 py-10 overflow-y-auto">

          {/* Breadcrumb pills */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{item.niche.toUpperCase()}</span>
            {item.tags.map(t => (
              <span key={t} className="text-gray-300">·</span>
            ))}
            {item.tags.map(t => (
              <span key={t} className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{t.toUpperCase()}</span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-[40px] font-bold text-black leading-tight mb-3">{title}</h1>

          {/* Description */}
          <p className="text-[15px] text-gray-500 italic mb-7 leading-relaxed">
            {isVideo
              ? `Stream-ready 9:16 footage you can drop into reels, ads, lead magnets, and content for the ${item.niche.replace(/-/g, " ")} niche. Re-edit, caption, brand it, ship it.`
              : `A complete guide you can read, reference, and repurpose for the ${item.niche.replace(/-/g, " ")} niche. Download, brand it, ship it.`}
          </p>

          {/* Included box */}
          <div className="border border-gray-200 rounded-xl p-4 mb-5 bg-gray-50/60">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="text-[12px] font-bold text-black uppercase tracking-widest">Included</p>
            </div>
            <p className="text-[13px] text-gray-500 ml-7 leading-relaxed">
              Included with your plan. Downloads do not spend credits on your current plan.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 mb-3">
            <button onClick={handleDownload} disabled={downloading}
              className="flex-[2] flex items-center justify-center gap-2 bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-60 text-[14px]">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {downloading ? "Downloading…" : "Download included"}
            </button>
            <Link href={`/dashboard/library?niche=${item.niche}&type=${backType}`}
              className="flex-1 flex items-center justify-center font-semibold py-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors text-[14px] text-gray-700 text-center">
              Browse pack
            </Link>
          </div>

          {/* Note + Save */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-[11.5px] text-gray-400">Included with your plan. No credits are spent.</p>
            <button onClick={handleFavorite}
              className={`flex items-center gap-1.5 text-[12px] transition-colors ${favorited ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}>
              <svg width="13" height="13" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Save
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-7">
            {[
              { label: "License",   value: "Commercial use" },
              { label: "Access",    value: "Lifetime"       },
              { label: "Royalties", value: "Included"       },
            ].map(s => (
              <div key={s.label} className="border border-gray-100 rounded-xl p-3.5">
                <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-[13px] font-semibold text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tag pills */}
          <div className="flex flex-wrap gap-2">
            <Link href={`/dashboard/library?niche=${item.niche}&type=${backType}`}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-[12px] font-semibold rounded-lg capitalize hover:bg-gray-200 transition-colors">
              {item.niche.replace(/-/g, " ")}
            </Link>
            {item.tags.map(t => (
              <span key={t} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-[12px] font-semibold rounded-lg uppercase">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Scrollable content below hero ─────────────────────────────────── */}

      {/* 4 ways creators ship footage */}
      <div className="border-t border-gray-100 px-10 py-14">
        <h2 className="text-[26px] font-bold text-black mb-8">
          4 ways creators are shipping with footage like this
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {USE_CASES.map(uc => (
            <div key={uc.title} className="border border-gray-100 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center mb-3 text-gray-600">
                <UseCaseIcon name={uc.icon} />
              </div>
              <p className="text-[14px] font-semibold text-black mb-1.5">{uc.title}</p>
              <p className="text-[13px] text-gray-500 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="border-t border-gray-100 px-10 py-14">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Common questions</p>
        <h2 className="text-[26px] font-bold text-black mb-8">Before you ship it</h2>
        <div className="grid grid-cols-2 gap-4">
          {FAQ.map(f => (
            <div key={f.q} className="border border-gray-100 rounded-2xl p-5">
              <p className="text-[14px] font-semibold text-black mb-2">{f.q}</p>
              <p className="text-[13px] text-gray-500 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* More from this pack */}
      {packItems.length > 0 && (
        <div className="border-t border-gray-100 px-10 py-14">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">More from this pack</p>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px] font-bold text-black">{nicheLabel} Pack</h2>
            <Link href={`/dashboard/library?niche=${item.niche}&type=${backType}`}
              className="text-[13px] font-semibold text-gray-500 hover:text-black transition-colors">
              See full pack →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3">
            {packItems.map(p => <SmallCard key={p.id} item={p} />)}
          </div>
        </div>
      )}

      {/* Related */}
      {relatedItems.length > 0 && (
        <div className="border-t border-gray-100 px-10 py-14">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Related</p>
          <h2 className="text-[22px] font-bold text-black mb-6">More from {nicheLabel}</h2>
          <div className="flex gap-3 overflow-x-auto pb-3">
            {relatedItems.map(r => <SmallCard key={r.id} item={r} />)}
          </div>
        </div>
      )}

    </div>
  )
}
