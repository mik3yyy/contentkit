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

function VideoCard({ item, cardW, cardH }: {
  item: VideoItem; cardW: number; cardH: number
}) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView]   = useState(false)
  const [playing, setPlaying] = useState(false)
  // Once mounted, keep the video element in the DOM — never unmount so the buffer is preserved.
  const hasLoaded = useRef(false)
  if (inView) hasLoaded.current = true

  // Per-card observer: load and play only this card when it's near the viewport.
  // rootMargin of 400px pre-loads the next few cards before they're visible.
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01, rootMargin: "0px 400px 0px 400px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView])

  return (
    <div
      ref={cardRef}
      className="relative shrink-0 rounded-2xl overflow-hidden bg-gray-200"
      style={{ width: cardW, height: cardH }}
    >
      {hasLoaded.current && item.videoUrl && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${playing ? "opacity-100" : "opacity-0"}`}
          src={item.videoUrl}
          autoPlay
          muted
          loop
          playsInline
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
}: Props) {
  const videoItems = items.filter(i => i.videoUrl)
  const capped = videoItems.slice(0, 8)
  const doubled = [...capped, ...capped]
  const cls = direction === "reverse" ? "marquee-rev" : speed === "slow" ? "marquee-slow" : "marquee"

  return (
    <div
      className="overflow-hidden w-full"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div className={`${cls} px-3`} style={{ gap: 10 }}>
        {doubled.map((item, i) => (
          <VideoCard key={`${item.id}-${i}`} item={item} cardW={cardW} cardH={cardH} />
        ))}
      </div>
    </div>
  )
}
