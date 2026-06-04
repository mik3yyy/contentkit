"use client"

import { useEffect, useRef } from "react"

const REVIEWS = [
  {
    stars: 5,
    quote: "Good mix of lifestyle, fitness and motivation content. I manage accounts for clients and the variety means I'm never recycling the same five clips across three brands.",
    name: "Ben C.",
    role: "Agency Owner",
    avatar: "B",
    statLabel: "Client accounts",
    statValue: "12",
  },
  {
    stars: 5,
    quote: "I honestly could not recommend this bundle more. Very excited about using it moving forward. The platform is a lot smoother than the Drive folders other sellers send you.",
    name: "Carlos R.",
    role: "Content Creator",
    avatar: "C",
    statLabel: "Clips used this month",
    statValue: "340+",
  },
  {
    stars: 5,
    quote: "Didn't expect to use it this much. Pulled clips for three separate niches in one sitting. The search actually works, which is more than I can say for most bundles.",
    name: "Aisha T.",
    role: "Faceless Page Owner",
    avatar: "A",
    statLabel: "Pages managed",
    statValue: "4",
  },
  {
    stars: 5,
    quote: "Used the templates as freebies for the newsletter — added 800 subscribers in two weeks. The rebrandable stuff alone is worth the price.",
    name: "Chris M.",
    role: "Newsletter Creator",
    avatar: "C",
    statLabel: "Subscribers in 14 days",
    statValue: "+800",
  },
  {
    stars: 5,
    quote: "I'd never made a product before. Slapped together a $29 clip pack from ContentKit, used the rebrander to caption the cover, listed it. Still feels fake honestly.",
    name: "Hannah C.",
    role: "First-time Seller",
    avatar: "H",
    statLabel: "First 30 days",
    statValue: "$1,400",
  },
  {
    stars: 5,
    quote: "Runs my entire TikTok shop content pipeline. I swap out the overlays, add a voiceover and post. Clients think I have a production team.",
    name: "Marcus L.",
    role: "TikTok Shop Creator",
    avatar: "M",
    statLabel: "Monthly revenue",
    statValue: "$3.2k",
  },
  {
    stars: 5,
    quote: "Bought it on a whim and ended up restructuring my whole offer around it. The ebooks gave me the lead magnets I'd been putting off making for six months.",
    name: "Priya S.",
    role: "Digital Product Seller",
    avatar: "P",
    statLabel: "Lead magnets launched",
    statValue: "8",
  },
  {
    stars: 4,
    quote: "Solid library. I spent a lot on editing assets in the past — individual packs that added up fast. This is just smarter. One payment and I stopped worrying about content.",
    name: "Jordan K.",
    role: "Video Editor",
    avatar: "J",
    statLabel: "Saved vs. individual packs",
    statValue: "$600+",
  },
  {
    stars: 5,
    quote: "My ad creatives went from embarrassing to actually competitive. The 4K clips especially — I was paying $40 per clip from stock sites before this.",
    name: "Sofia D.",
    role: "Paid Ads Buyer",
    avatar: "S",
    statLabel: "Ad accounts running",
    statValue: "6",
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= count ? "#111" : "#e5e7eb"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review, index }: { review: typeof REVIEWS[0]; index: number }) {
  return (
    <div
      className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Stars count={review.stars} />
      <p className="text-[14.5px] text-gray-700 leading-relaxed mb-6">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-[13px] font-bold text-gray-600 shrink-0">
          {review.avatar}
        </div>
        <div>
          <div className="text-[13px] font-bold text-black">{review.name}</div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{review.role}</div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{review.statLabel}</span>
          <span className="text-[13px] font-bold text-black">{review.statValue}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sold</span>
          <span className="text-[12px] font-semibold text-gray-500">ContentKit Lifetime</span>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const col1 = REVIEWS.filter((_, i) => i % 3 === 0)
  const col2 = REVIEWS.filter((_, i) => i % 3 === 1)
  const col3 = REVIEWS.filter((_, i) => i % 3 === 2)

  const colRef1 = useRef<HTMLDivElement>(null)
  const colRef2 = useRef<HTMLDivElement>(null)
  const colRef3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame: number
    const onScroll = () => {
      frame = requestAnimationFrame(() => {
        const sy = window.scrollY
        if (colRef1.current) colRef1.current.style.transform = `translateY(${sy * 0.04}px)`
        if (colRef2.current) colRef2.current.style.transform = `translateY(${sy * -0.03}px)`
        if (colRef3.current) colRef3.current.style.transform = `translateY(${sy * 0.05}px)`
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame) }
  }, [])

  return (
    <section className="bg-[#f5f4f2] py-24 overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">

        {/* Header */}
        <div className="grid grid-cols-2 gap-16 items-start mb-20">
          <div>
            <div className="inline-flex items-center border border-gray-300 rounded-full px-4 py-1 mb-6">
              <span className="text-[10.5px] font-semibold text-gray-500 uppercase tracking-[0.15em]">Creator Reviews</span>
            </div>
            <h2 className="text-[46px] leading-[1.05] tracking-tight">
              <span className="font-black text-black">Different creators,</span>{" "}
              <span className="font-light italic text-gray-400">different use cases, same vault.</span>
            </h2>
          </div>
          <div className="pt-4">
            <p className="text-[16px] text-gray-500 leading-relaxed">
              Faceless page owners, ad buyers, agency owners, and resellers all pull from the same vault. Same clips, different angles — theme pages, ads, client work, or clip packs of their own.
            </p>
          </div>
        </div>

        {/* Staggered 3-column grid */}
        <div className="grid grid-cols-3 gap-5 items-start">
          <div ref={colRef1} className="flex flex-col gap-5 mt-10 will-change-transform">
            {col1.map((r, i) => <ReviewCard key={i} review={r} index={i} />)}
          </div>
          <div ref={colRef2} className="flex flex-col gap-5 -mt-8 will-change-transform">
            {col2.map((r, i) => <ReviewCard key={i} review={r} index={i} />)}
          </div>
          <div ref={colRef3} className="flex flex-col gap-5 mt-16 will-change-transform">
            {col3.map((r, i) => <ReviewCard key={i} review={r} index={i} />)}
          </div>
        </div>

      </div>
    </section>
  )
}
