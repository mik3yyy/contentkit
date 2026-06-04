"use client"

interface MarqueeStripProps {
  images: string[]
  direction?: "forward" | "reverse"
  speed?: "normal" | "slow"
  imgClass?: string
  gap?: number
}

export default function MarqueeStrip({
  images,
  direction = "forward",
  speed = "normal",
  imgClass = "w-[130px] h-[220px] rounded-2xl object-cover shrink-0",
  gap = 12,
}: MarqueeStripProps) {
  const cls =
    direction === "reverse"
      ? "marquee-rev"
      : speed === "slow"
        ? "marquee-slow"
        : "marquee"

  const doubled = [...images, ...images]

  return (
    <div className="overflow-hidden w-full">
      <div className={`${cls} px-3`} style={{ gap }}>
        {doubled.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" className={imgClass} loading="lazy" />
        ))}
      </div>
    </div>
  )
}
