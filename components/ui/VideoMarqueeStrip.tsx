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
  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden bg-gray-900"
      style={{ width: cardW, height: cardH }}
    >
      {/* Thumbnail — permanent base so the card is never blank */}
      {item.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnailUrl}
          alt={item.niche}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Video — mounted once the strip enters the viewport; browser handles autoplay */}
      {active && item.videoUrl && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={item.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
      )}

      {/* Subtle depth gradient */}
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

  const videoItems = items.filter(i => i.videoUrl)
  const doubled = [...videoItems, ...videoItems]
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
