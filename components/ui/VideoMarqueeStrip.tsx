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
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v || !active || !item.videoUrl) return
    v.muted = true
    const onMeta   = () => { v.currentTime = 0; v.play().catch(() => {}) }
    const onLoaded = () => setReady(true)
    v.addEventListener("loadedmetadata", onMeta)
    v.addEventListener("canplay",        onLoaded)
    if (v.readyState >= 2) { v.play().catch(() => {}); setReady(true) }
    return () => {
      v.removeEventListener("loadedmetadata", onMeta)
      v.removeEventListener("canplay",        onLoaded)
    }
  }, [active, item.videoUrl])

  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden bg-gray-900"
      style={{ width: cardW, height: cardH }}
    >
      {/* Thumbnail — always visible as base/poster */}
      {item.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnailUrl}
          alt={item.niche}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Video fades in when playing */}
      {active && item.videoUrl && (
        <video
          ref={videoRef}
          src={item.videoUrl}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}

      {/* Subtle gradient overlay for depth */}
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
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const doubled = [...items, ...items]
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
