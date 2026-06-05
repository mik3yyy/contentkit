import VideoMarqueeStrip, { type VideoItem } from "@/components/ui/VideoMarqueeStrip"
import MarqueeStrip from "@/components/ui/MarqueeStrip"

const IMG_CLASS = "w-[155px] h-[205px] rounded-xl object-cover shrink-0"

const FALLBACK: Record<string, string[]> = {
  luxury: [
    "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=170&h=220&fit=crop&q=75",
  ],
  fitness: [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=170&h=220&fit=crop&q=75",
  ],
  "money-finance": [
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1559526324-593bc073d938?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=170&h=220&fit=crop&q=75",
  ],
  motivation: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1542596594-649edbc13630?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=170&h=220&fit=crop&q=75",
  ],
  gaming: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1527334919515-b8dee906a34b?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1570303345338-e1f0eddf4946?w=170&h=220&fit=crop&q=75",
  ],
  cars: [
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=170&h=220&fit=crop&q=75",
  ],
  food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1540189549336-e6e99eb4b110?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=170&h=220&fit=crop&q=75",
  ],
  travel: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=170&h=220&fit=crop&q=75",
    "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=170&h=220&fit=crop&q=75",
  ],
}

function NicheRow({
  title, count, nicheKey, items, direction,
}: {
  title: string; count: string; nicheKey: string
  items: VideoItem[]; direction: "forward" | "reverse"
}) {
  const liveItems = items.filter(i => i.videoUrl)
  const fallback  = FALLBACK[nicheKey] ?? []

  return (
    <div className="mb-10">
      <div className="max-w-[1160px] mx-auto px-6 mb-3 flex items-center gap-3">
        <span className="text-[12px] font-black uppercase tracking-wider">{title}</span>
        <span className="text-[12px] text-gray-400 font-medium">{count}</span>
      </div>
      {liveItems.length >= 3
        ? <VideoMarqueeStrip items={liveItems} direction={direction} speed="slow" cardW={155} cardH={205} />
        : <MarqueeStrip images={fallback} direction={direction} speed="slow" imgClass={IMG_CLASS} gap={10} />
      }
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
      <NicheRow title="Luxury"          count="18,400+ clips" nicheKey="luxury"        items={nicheItems["luxury"]        ?? []} direction="forward" />
      <NicheRow title="Fitness"         count="12,200+ clips" nicheKey="fitness"       items={nicheItems["fitness"]       ?? []} direction="reverse" />
      <NicheRow title="Money & Finance" count="7,600+ clips"  nicheKey="money-finance" items={nicheItems["money-finance"] ?? []} direction="forward" />
      <NicheRow title="Motivation"      count="11,300+ clips" nicheKey="motivation"    items={nicheItems["motivation"]    ?? []} direction="reverse" />
      <NicheRow title="Gaming"          count="3,900+ clips"  nicheKey="gaming"        items={nicheItems["gaming"]        ?? []} direction="forward" />
      <NicheRow title="Cars"            count="4,800+ clips"  nicheKey="cars"          items={nicheItems["cars"]          ?? []} direction="reverse" />
      <NicheRow title="Food"            count="6,100+ clips"  nicheKey="food"          items={nicheItems["food"]          ?? []} direction="forward" />
      <NicheRow title="Travel"          count="7,600+ clips"  nicheKey="travel"        items={nicheItems["travel"]        ?? []} direction="reverse" />
    </section>
  )
}
