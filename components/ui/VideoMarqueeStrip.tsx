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

function VideoCard({ item, mounted, cardW, cardH }: {
  item: VideoItem; mounted: boolean; cardW: number; cardH: number
}) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  // Track current intersection state so we can play immediately when video mounts.
  const inView = useRef(false)

  // Observer on the div (always in DOM). Controls play/pause only — never unmount.
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
        const v = videoRef.current
        if (!v) return
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.01 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // When the video element mounts (strip enters preload zone), play if card is already visible.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !mounted) return
    if (inView.current) v.play().catch(() => {})
  }, [mounted])

  return (
    <div
      ref={cardRef}
      className="relative shrink-0 rounded-2xl overflow-hidden bg-gray-200"
      style={{ width: cardW, height: cardH }}
    >
      {mounted && item.videoUrl && (
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
  eager = false,
}: Props) {
  // eager=true (hero): mount all videos immediately on page load — highest priority.
  // eager=false (below fold): mount all videos when strip is 600px from viewport.
  const [mounted, setMounted] = useState(eager)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (eager) return
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
  // 6 per strip keeps memory lean; doubled for seamless CSS marquee loop.
  // The browser serves the second copy from cache (same URL), so no extra network hit.
  const capped = videoItems.slice(0, 6)
  const doubled = [...capped, ...capped]
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
          <VideoCard key={`${item.id}-${i}`} item={item} mounted={mounted} cardW={cardW} cardH={cardH} />
        ))}
      </div>
    </div>
  )
}
