"use client"

import { useEffect, useRef, useState } from "react"

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
    quote: "Used the templates as freebies for the newsletter — added 800 subscribers in two weeks. The rebrandable stuff alone is worth the price.",
    name: "Chris M.",
    role: "Newsletter Creator",
    avatar: "C",
    statLabel: "Subscribers in 14 days",
    statValue: "+800",
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
  {
    stars: 5,
    quote: "I honestly could not recommend this bundle more. The platform is a lot smoother than the Drive folders other sellers send you.",
    name: "Carlos R.",
    role: "Content Creator",
    avatar: "C",
    statLabel: "Clips used this month",
    statValue: "340+",
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
    quote: "Didn't expect to use it this much. Pulled clips for three separate niches in one sitting. The search actually works, which is more than I can say for most bundles.",
    name: "Aisha T.",
    role: "Faceless Page Owner",
    avatar: "A",
    statLabel: "Pages managed",
    statValue: "4",
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
    quote: "One payment and I stopped worrying about content. I was spending $600+ on individual stock packs. This just makes more sense.",
    name: "Jordan K.",
    role: "Video Editor",
    avatar: "J",
    statLabel: "Saved vs. stock packs",
    statValue: "$600+",
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

function ReviewCard({ review, delay }: { review: typeof REVIEWS[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transitionDelay: `${delay}ms`,
      }}
    >
      <Stars count={review.stars} />
      <p className="text-[14px] text-gray-700 leading-relaxed mb-6">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[13px] font-bold text-gray-600 shrink-0">
          {review.avatar}
        </div>
        <div>
          <div className="text-[13px] font-bold text-black">{review.name}</div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{review.role}</div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4 space-y-1.5">
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

  return (
    <section className="bg-[#f5f4f2] py-24 overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 md:gap-12 items-start mb-12 md:mb-20">
          <div>
            <div className="inline-flex items-center border border-gray-300 rounded-full px-4 py-1 mb-6">
              <span className="text-[10.5px] font-semibold text-gray-500 uppercase tracking-[0.15em]">Creator Reviews</span>
            </div>
            <h2 className="text-[30px] md:text-[38px] leading-[1.1] tracking-tight">
              <span className="font-black text-black">Different creators,</span>
              <br />
              <span className="font-light italic text-gray-400">different use cases,</span>
              <br />
              <span className="font-light italic text-gray-400">same vault.</span>
            </h2>
          </div>
          <div className="md:pt-14">
            <p className="text-[15px] text-gray-500 leading-relaxed">
              Faceless page owners, ad buyers, agency owners, and resellers all pull from the same vault. Same clips, different angles — theme pages, ads, client work, or clip packs of their own.
            </p>
          </div>
        </div>

        {/* Staggered 3-column grid — each card animates in on scroll */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:items-start">
          <div className="flex flex-col gap-5">
            {col1.map((r, i) => <ReviewCard key={i} review={r} delay={i * 100} />)}
          </div>
          <div className="flex flex-col gap-5 md:mt-12">
            {col2.map((r, i) => <ReviewCard key={i} review={r} delay={i * 100 + 60} />)}
          </div>
          <div className="flex flex-col gap-5 md:mt-6">
            {col3.map((r, i) => <ReviewCard key={i} review={r} delay={i * 100 + 30} />)}
          </div>
        </div>

      </div>
    </section>
  )
}
