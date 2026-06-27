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
  mounted: boolean
  isMobile: boolean
  cardW: number
  cardH: number
}) {
  const cardRef      = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const [playing,     setPlaying]     = useState(false)
  const [selfMounted, setSelfMounted] = useState(false)
  const inView = useRef(false)

  // Per-card observer: always on the div wrapper.
  // Mobile: mounts video when card is 400px from viewport, starts downloading immediately.
  // Desktop: controls play/pause only (strip-level observer handles mounting).
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
        if (isMobile && entry.isIntersecting) setSelfMounted(true)
        const v = videoRef.current
        if (!v) return
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      // 400px lookahead on mobile: card starts downloading well before user reaches it.
      { threshold: 0.01, rootMargin: isMobile ? "400px 0px" : "0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isMobile])

  // Mobile: once the video element mounts (selfMounted flips), call play() if already in view.
  // This closes the race where the observer fired before the <video> existed in the DOM.
  useEffect(() => {
    if (!isMobile || !selfMounted) return
    const v = videoRef.current
    if (!v) return
    if (inView.current) v.play().catch(() => {})
  }, [selfMounted, isMobile])

  // Desktop: play when the strip-level batch mount fires.
  useEffect(() => {
    if (isMobile) return
    const v = videoRef.current
    if (!v || !mounted) return
    if (inView.current) v.play().catch(() => {})
  }, [mounted, isMobile])

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
          // preload="auto" on mobile too: as soon as the element mounts (400px ahead),
          // browser starts buffering so video is ready before user scrolls to it.
          preload="auto"
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
  const [mounted,  setMounted]  = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)

    if (mobile) return // mobile: per-card VideoCard handles mounting

    if (eager) {
      setMounted(true)
      return
    }

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
  const minLen = isMobile
    ? Math.ceil(430 / stride) + 1
    : Math.ceil(1920 / stride) + 2
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
