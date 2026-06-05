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
}

function VideoCard({ item, active, cardW, cardH }: {
  item: VideoItem; active: boolean; cardW: number; cardH: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    // When strip leaves viewport: reset so shimmer shows again on re-entry
    if (!active) {
      setPlaying(false)
      return
    }

    const v = videoRef.current
    if (!v) return

    const onPlaying = () => setPlaying(true)
    // canplay fires when enough data is buffered — retry play() here for iOS
    const onCanPlay = () => { v.play().catch(() => {}) }

    v.addEventListener("playing", onPlaying)
    v.addEventListener("canplay", onCanPlay)

    // First attempt — may succeed immediately or wait for canplay
    v.play().catch(() => {})

    return () => {
      v.removeEventListener("playing", onPlaying)
      v.removeEventListener("canplay", onCanPlay)
    }
  }, [active]) // runs whenever active flips — NOT just on mount

  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden bg-gray-900"
      style={{ width: cardW, height: cardH }}
    >
      {/* Shimmer while video hasn't started — never shows a frozen frame or play icon */}
      {!playing && <div className="absolute inset-0 shimmer-dark" />}

      {/* Video — opacity-0 until playing fires, then fades in */}
      {active && item.videoUrl && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
          src={item.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
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
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { setActive(entry.isIntersecting) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const videoItems = items.filter(i => i.videoUrl)
  // Cap at 8 per strip (16 doubled) — keeps simultaneous decoder count low on mobile
  const capped = videoItems.slice(0, 8)
  const doubled = [...capped, ...capped]
  const cls = direction === "reverse" ? "marquee-rev" : speed === "slow" ? "marquee-slow" : "marquee"

  return (
    <div
      ref={wrapRef}
      className="overflow-hidden w-full"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div className={`${cls} px-3`} style={{ gap: 10 }}>
        {doubled.map((item, i) => (
          <VideoCard key={`${item.id}-${i}`} item={item} active={active} cardW={cardW} cardH={cardH} />
        ))}
      </div>
    </div>
  )
}
