import Link from "next/link"
import MarqueeStrip from "@/components/ui/MarqueeStrip"

const STRIP_IMAGES = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=340&fit=crop&q=75",
  "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=200&h=340&fit=crop&q=75",
]

const AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&q=80",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&q=80",
]

export default function Hero() {
  return (
    <section className="bg-[#eeecea] pt-20 pb-0 text-center overflow-hidden">
      <div className="max-w-[860px] mx-auto px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-12">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.12em]">
            Videos &amp; Ebooks · Instant Download
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-black leading-[0.93] tracking-[-0.035em] text-black" style={{ fontSize: "clamp(52px,7vw,88px)" }}>
          100,000+ videos<br />&amp; ebooks.
        </h1>
        <p className="font-light italic leading-[1.0] tracking-[-0.035em] text-gray-300 mt-2 mb-12" style={{ fontSize: "clamp(52px,7vw,88px)" }}>
          One payment.
        </p>

        {/* Sub */}
        <p className="text-[17px] text-gray-600 leading-relaxed max-w-[600px] mx-auto mb-10">
          <strong className="text-black font-semibold">100,000+ HD videos and ebooks</strong> across 50+ niches.
          Post them on TikTok, Reels, Shorts —{" "}
          <strong className="text-black font-semibold">or resell them as your own</strong>.
          One payment. Lifetime access.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Link href="#pricing" className="flex items-center gap-2 bg-black text-white font-semibold text-[15px] px-8 py-4 rounded-2xl hover:bg-gray-900 transition-colors">
            Get ContentKit
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
          <Link href="#whats-inside" className="flex items-center gap-2 bg-white text-black font-semibold text-[15px] px-8 py-4 rounded-2xl border border-gray-300 hover:border-gray-500 transition-colors">
            See what&apos;s inside
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <div className="flex -space-x-2.5">
            {AVATARS.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-[#eeecea] object-cover" />
            ))}
          </div>
          <p className="text-[14px] text-gray-600">
            <strong className="text-black">5,000+</strong> happy creators
          </p>
        </div>
      </div>

      {/* Scrolling strip */}
      <MarqueeStrip images={STRIP_IMAGES} direction="forward" speed="normal" />
    </section>
  )
}
