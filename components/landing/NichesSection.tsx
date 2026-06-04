import MarqueeStrip from "@/components/ui/MarqueeStrip"

const LUXURY = [
  "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=170&h=220&fit=crop&q=75",
]

const FITNESS = [
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=170&h=220&fit=crop&q=75",
]

const MONEY = [
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1559526324-593bc073d938?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=170&h=220&fit=crop&q=75",
]

const MOTIVATION = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1542596594-649edbc13630?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=170&h=220&fit=crop&q=75",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=170&h=220&fit=crop&q=75",
]

const IMG_CLASS = "w-[155px] h-[205px] rounded-xl object-cover shrink-0"

function NicheRow({ title, count, images, direction }: { title: string; count: string; images: string[]; direction: "forward" | "reverse" }) {
  return (
    <div className="mb-10">
      <div className="max-w-[1160px] mx-auto px-6 mb-3 flex items-center gap-3">
        <span className="text-[12px] font-black uppercase tracking-wider">{title}</span>
        <span className="text-[12px] text-gray-400 font-medium">{count}</span>
      </div>
      <MarqueeStrip images={images} direction={direction} speed="slow" imgClass={IMG_CLASS} gap={10} />
    </div>
  )
}

export default function NichesSection() {
  return (
    <section id="niches" className="bg-[#eeecea] pt-8 pb-16">
      <div className="max-w-[1160px] mx-auto px-6 mb-10">
        <h2 className="font-black tracking-tight text-black inline" style={{ fontSize: "clamp(36px,5vw,58px)" }}>Every niche.</h2>
        <span className="font-light italic tracking-tight text-gray-400 ml-3" style={{ fontSize: "clamp(36px,5vw,58px)" }}>Ready to post.</span>
        <p className="text-[16px] text-gray-500 mt-3">Browse a taste of what&apos;s inside — <strong className="text-black font-semibold">50+ categories</strong>, all yours from day one.</p>
      </div>
      <NicheRow title="Luxury"           count="18,400+ clips" images={LUXURY}     direction="forward" />
      <NicheRow title="Fitness"          count="12,200+ clips" images={FITNESS}    direction="reverse" />
      <NicheRow title="Money & Finance"  count="7,600+ clips"  images={MONEY}      direction="forward" />
      <NicheRow title="Motivation"       count="11,300+ clips" images={MOTIVATION} direction="reverse" />
    </section>
  )
}
