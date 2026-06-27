"use client"

import { useEffect, useRef, useState } from "react"

export interface VideoItem {
  id: string
  videoUrl?: string | null
  thumbnailUrl: string | null
  niche: string
}

interface Props {
  items: VideoItem[]
  direction?: "forward" | "reverse"
  speed?: "normal" | "slow"
  cardW?: number
  cardH?: number
  eager?: boolean
}

function VideoCard({ item, mounted, isMobile, cardW, cardH }: {
  item: VideoItem
  mounted: boolean    // desktop: strip-level gate
  isMobile: boolean   // mobile: per-card gate
  cardW: number
  cardH: number
}) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing,     setPlaying]     = useState(false)
  const [selfMounted, setSelfMounted] = useState(false)  // mobile only
  const inView = useRef(false)

  // Per-card observer — always on the div.
  // Desktop: controls play/pause only (video already mounted by strip).
  // Mobile: also gates whether the video element exists (per-card lazy).
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
        // Mobile: mount this card's video when it enters the viewport.
        if (isMobile && entry.isIntersecting) setSelfMounted(true)
        const v = videoRef.current
        if (!v) return
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      // Mobile: 80px lookahead so video loads just before visible.
      // Desktop: no margin needed — strip-level preloading handles it.
      { threshold: 0.01, rootMargin: isMobile ? "80px 0px" : "0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isMobile])

  // Desktop: when the strip mounts all videos, play if this card is already in view.
  useEffect(() => {
    if (isMobile) return
    const v = videoRef.current
    if (!v || !mounted) return
    if (inView.current) v.play().catch(() => {})
  }, [mounted, isMobile])

  // Desktop: strip gate. Mobile: per-card gate.
  const shouldMount = isMobile ? selfMounted : mounted

  return (
    <div
      ref={cardRef}
      className="relative shrink-0 rounded-2xl overflow-hidden bg-gray-200"
      style={{ width: cardW, height: cardH }}
    >
      {shouldMount && item.videoUrl && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${playing ? "opacity-100" : "opacity-0"}`}
          src={item.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          // Desktop: auto so all strip videos preload before visible.
          // Mobile: metadata to avoid any buffering until play() is called.
          preload={isMobile ? "metadata" : "auto"}
          onPlaying={() => setPlaying(true)}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </div>
  )
}

export default function VideoMarqueeStrip({
  items,
  direction = "forward",
  speed = "normal",
  cardW = 155,
  cardH = 210,
  eager = false,
}: Props) {
  // Always start unmounted — useEffect detects device and sets the right strategy.
  const [mounted,  setMounted]  = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)

    if (mobile) {
      // Mobile: per-card lazy loading in VideoCard handles everything. No strip-level mount.
      return
    }

    // Desktop eager (hero): mount all videos immediately.
    if (eager) {
      setMounted(true)
      return
    }

    // Desktop non-eager: mount all videos when strip is 600px from viewport.
    const el = stripRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setMounted(true) },
      { threshold: 0, rootMargin: "600px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [eager])

  const videoItems = items.filter(i => i.videoUrl)
  const unique = videoItems.slice(0, 6)
  const stride = cardW + 10

  // Mobile screens (~430px) need far fewer cards than desktop (1920px).
  // Each firstCopy must be wider than the screen or the seamless loop shows a gap.
  const minLen = isMobile
    ? Math.ceil(430 / stride) + 1   // ~4 items → 8 doubled — light on mobile
    : Math.ceil(1920 / stride) + 2  // ~14 items → 28 doubled — gap-free on desktop
  const firstCopy = unique.length > 0
    ? Array.from({ length: Math.max(minLen, unique.length) }, (_, i) => unique[i % unique.length])
    : []
  const doubled = [...firstCopy, ...firstCopy]
  const cls = direction === "reverse" ? "marquee-rev" : speed === "slow" ? "marquee-slow" : "marquee"

  return (
    <div
      ref={stripRef}
      className="overflow-hidden w-full"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div className={`${cls} px-3`} style={{ gap: 10 }}>
        {doubled.map((item, i) => (
          <VideoCard
            key={`${item.id}-${i}`}
            item={item}
            mounted={mounted}
            isMobile={isMobile}
            cardW={cardW}
            cardH={cardH}
          />
        ))}
      </div>
    </div>
  )
}
