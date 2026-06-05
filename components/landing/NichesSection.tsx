import VideoMarqueeStrip, { type VideoItem } from "@/components/ui/VideoMarqueeStrip"

function NicheRow({
  title, count, items, direction,
}: {
  title: string; count: string
  items: VideoItem[]; direction: "forward" | "reverse"
}) {
  if (items.filter(i => i.videoUrl).length < 3) return null
  return (
    <div className="mb-10">
      <div className="max-w-[1160px] mx-auto px-6 mb-3 flex items-center gap-3">
        <span className="text-[12px] font-black uppercase tracking-wider">{title}</span>
        <span className="text-[12px] text-gray-400 font-medium">{count}</span>
      </div>
      <VideoMarqueeStrip items={items} direction={direction} speed="slow" cardW={155} cardH={205} />
    </div>
  )
}

export default function NichesSection({ nicheItems }: { nicheItems: Record<string, VideoItem[]> }) {
  return (
    <section id="niches" className="bg-[#eeecea] pt-8 pb-16">
      <div className="max-w-[1160px] mx-auto px-6 mb-10">
        <h2 className="font-black tracking-tight text-black inline" style={{ fontSize: "clamp(36px,5vw,58px)" }}>Every niche.</h2>
        <span className="font-light italic tracking-tight text-gray-400 ml-3" style={{ fontSize: "clamp(36px,5vw,58px)" }}>Ready to post.</span>
        <p className="text-[16px] text-gray-500 mt-3">Browse a taste of what&apos;s inside — <strong className="text-black font-semibold">50+ categories</strong>, all yours from day one.</p>
      </div>
      <NicheRow title="Luxury"          count="18,400+ clips" items={nicheItems["luxury"]        ?? []} direction="forward" />
      <NicheRow title="Fitness"         count="12,200+ clips" items={nicheItems["fitness"]       ?? []} direction="reverse" />
      <NicheRow title="Money & Finance" count="7,600+ clips"  items={nicheItems["money-finance"] ?? []} direction="forward" />
      <NicheRow title="Motivation"      count="11,300+ clips" items={nicheItems["motivation"]    ?? []} direction="reverse" />
    </section>
  )
}
