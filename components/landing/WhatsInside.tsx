"use client"

import { useEffect, useRef, useState } from "react"

const NICHES_TOP = [
  ["Luxury","12,400+"],["Fitness","9,800+"],["Money","8,200+"],["Travel","7,600+"],["Motivation","6,900+"],["Food","6,100+"],
]
const NICHES_BOT = [
  ["Lifestyle","5,400+"],["Nature","5,200+"],["Cars","4,800+"],["Business","4,600+"],["Gaming","3,900+"],["Animals","3,700+"],
]
const NICHES_SMALL = [
  "Calisthenics","Real Estate","Crypto","Beauty","Fashion","Tech","Cooking","Self-help","Pets","Mindset",
]

const TEMPLATES = ["Offer Page","Welcome Email","Hook List","Content Plan","Lead Magnet","Sound Pack"]

export type ClipItem  = { id: string; videoUrl: string; thumbnailUrl: string | null }
export type EbookItem = { id: string; thumbnailUrl: string | null; title: string }

// ── Autoplay video — calls play() after mount for iOS Safari compatibility ────

function AutoplayVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    ref.current?.play().catch(() => {})
  }, [])
  return (
    <video
      ref={ref}
      src={src}
      autoPlay muted loop playsInline preload="metadata"
      className={className}
    />
  )
}

// ── Vertical ebook marquee ───────────────────────────────────────────────────

function EbookColumn({ items, direction }: { items: EbookItem[]; direction: "down" | "up" }) {
  const doubled = [...items, ...items]
  const cls = direction === "down" ? "marquee-vert-down" : "marquee-vert-up"
  return (
    <div className="flex-1 overflow-hidden">
      <div className={cls} style={{ gap: 10 }}>
        {doubled.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="shrink-0 rounded-xl overflow-hidden bg-gray-200"
            style={{ aspectRatio: "3/4", minHeight: 100 }}
          >
            {item.thumbnailUrl
              ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              )
              : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                  <svg width="24" height="24" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
              )
            }
          </div>
        ))}
      </div>
    </div>
  )
}

function EbookMarquee({ items }: { items: EbookItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const cols = 4
  const perCol = Math.max(3, Math.ceil(items.length / cols))
  const columns = Array.from({ length: cols }, (_, c) => {
    const slice = items.slice(c * perCol, (c + 1) * perCol)
    return slice.length ? slice : items.slice(0, perCol)
  })

  return (
    <div
      ref={wrapRef}
      className="flex gap-2.5 overflow-hidden rounded-2xl"
      style={{
        height: 260,
        maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        opacity: active ? 1 : 0,
        transition: "opacity 0.6s",
      }}
    >
      {columns.map((col, i) => (
        // columns 2 & 3 hidden on mobile — 2-column layout keeps it readable on small screens
        <div key={i} className={i >= 2 ? "hidden sm:contents" : "contents"}>
          <EbookColumn items={col} direction={i % 2 === 0 ? "down" : "up"} />
        </div>
      ))}
    </div>
  )
}

// ── Main section ─────────────────────────────────────────────────────────────

export default function WhatsInside({
  clipItems,
  ebookItems,
}: {
  clipItems:  ClipItem[]
  ebookItems: EbookItem[]
}) {
  return (
    <section id="whats-inside" className="bg-[#eeecea] py-12">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="inline-flex items-center border border-gray-300 bg-white/50 rounded-full px-4 py-1 mb-6">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">What&apos;s Inside ContentKit</span>
        </div>
        <h2 className="font-black leading-[0.93] tracking-tight text-black" style={{ fontSize: "clamp(30px,5vw,62px)" }}>Videos are the main event.</h2>
        <p className="font-light italic leading-[1.05] tracking-tight text-gray-300 mb-10" style={{ fontSize: "clamp(30px,5vw,62px)" }}>The ebooks come free on top.</p>

        {/* Clips card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 mb-5 border border-gray-100 shadow-sm">
          <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 mb-5">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">100,000+ Clips · The Main Event</span>
          </div>
          <h3 className="text-[24px] md:text-[30px] font-bold text-black mb-2">Faceless HD &amp; 4K clips</h3>
          <p className="text-[14px] md:text-[15px] text-gray-500 leading-relaxed mb-6 max-w-[500px]">Stream-ready 9:16 footage across 50+ niches — luxury, fitness, food, business, motivation, nature. Post-ready for TikTok, Reels, Shorts.</p>

          {clipItems.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-6">
              {clipItems.slice(0, Math.min(7, clipItems.length)).map((item, idx) => (
                // On mobile only 3 clips play — fewer simultaneous decoders = smoother playback
                <div
                  key={item.id}
                  className={`relative rounded-xl overflow-hidden bg-gray-900 ${idx >= 3 ? "hidden md:block" : ""}`}
                  style={{ height: 175 }}
                >
                  {item.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <AutoplayVideo src={item.videoUrl} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Top Niches by Clip Count</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {NICHES_TOP.map(([n, c]) => (
              <span key={n} className="flex items-center justify-between gap-5 border border-gray-200 rounded-lg px-3 py-2 text-[12px]">
                <span className="font-medium">{n}</span><span className="text-gray-400">{c}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {NICHES_BOT.map(([n, c]) => (
              <span key={n} className="flex items-center justify-between gap-5 border border-gray-200 rounded-lg px-3 py-2 text-[12px]">
                <span className="font-medium">{n}</span><span className="text-gray-400">{c}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {NICHES_SMALL.map(n => (
              <span key={n} className="border border-gray-100 bg-gray-50 rounded-md px-2 py-1 text-[10px] font-medium text-gray-400">
                {n}
              </span>
            ))}
            <span className="border border-gray-100 bg-gray-50 rounded-md px-2 py-1 text-[10px] font-medium text-gray-300 italic">
              +40 more…
            </span>
          </div>
          <p className="text-[10.5px] text-gray-400 uppercase tracking-wider font-semibold">50+ Niches Total · New Content Added Weekly</p>
        </div>

        {/* Ebooks + Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm overflow-hidden">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 mb-5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">5,000+ Files · Bonus Included</span>
            </div>
            <h3 className="text-[22px] md:text-[26px] font-bold text-black mb-3">Ebooks &amp; guides</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6">Rebrandable PDFs you can rename and resell as your own — or give away as a freebie. Self-help, finance, wellness, productivity.</p>
            <EbookMarquee items={ebookItems} />
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 mb-5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Plug-and-Play · Bonus Included</span>
            </div>
            <h3 className="text-[22px] md:text-[26px] font-bold text-black mb-3">Templates, presets &amp; sounds</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6">Lead magnets, hook lists, IG carousels, content calendars, offer pages, email templates, sound packs.</p>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <div key={t} className="border border-gray-200 rounded-xl px-3 md:px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
