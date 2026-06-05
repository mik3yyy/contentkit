import CheckoutForm from "@/app/checkout/CheckoutForm"

const FEATURES = [
  "100,000+ faceless HD & 4K clips for TikTok, Reels, Shorts, ads, and client work",
  "5,000+ rebrandable ebooks, templates, sounds, presets, and lead magnets",
  "Full resell rights so you can post, bundle, edit, resell, or hand assets to clients",
  "Lifetime access, lifetime updates, no monthly subscription, no credit card tricks",
  "Affiliate program access — earn 60% commission",
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#eeecea] py-12 md:py-24 min-h-screen flex flex-col justify-center">
      <div className="max-w-[1040px] mx-auto px-6 w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-400 mb-5">
            Secure Checkout
          </p>
          <h2 className="text-[28px] sm:text-[38px] md:text-[52px] tracking-tight leading-tight mb-3">
            <span className="font-black text-black">One payment.</span>{" "}
            <span className="font-light italic text-gray-400">Open the ContentKit forever.</span>
          </h2>
          <div className="flex items-center justify-center gap-6 text-[12px] font-semibold tracking-[0.12em] uppercase text-gray-400">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
              Pay once
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
              Open the vault
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] rounded-3xl overflow-hidden shadow-2xl">

          {/* Left — dark product info (shows second on mobile so checkout is immediately visible) */}
          <div className="bg-[#111] p-10 flex flex-col order-2 md:order-1">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-7 flex-wrap">
              {[
                { label: "Lifetime", green: true },
                { label: "Money-back guarantee", green: false },
                { label: "Instant access", green: false },
              ].map(b => (
                <span
                  key={b.label}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${b.green ? "bg-green-500/20 text-green-400" : "bg-white/10 text-gray-400"}`}
                >
                  {b.green && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                  {b.label}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-[34px] leading-tight mb-3">
              <span className="font-black text-white">ContentKit</span>{" "}
              <span className="font-light italic text-gray-400">Lifetime</span>
            </h3>
            <p className="text-[13.5px] text-gray-400 leading-relaxed mb-8">
              The full content shelf —{" "}
              <strong className="text-gray-200">clips, rebrandable products, commercial rights</strong>,
              and lifetime updates. Buy once, use forever.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-8">
              {[
                { n: "100K+", l: "HD & 4K clips",  lMobile: "Clips"    },
                { n: "5,000+", l: "Rebrandable",    lMobile: "Products" },
                { n: "50+",   l: "Niches",          lMobile: "Niches"   },
              ].map(s => (
                <div key={s.l} className="bg-white/5 rounded-2xl p-2.5 sm:p-4">
                  <div className="text-[16px] sm:text-[22px] font-black text-white leading-tight">{s.n}</div>
                  <div className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide font-semibold leading-tight">
                    <span className="sm:hidden">{s.lMobile}</span>
                    <span className="hidden sm:block">{s.l}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <ul className="space-y-3 flex-1">
              {FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-[12.5px] text-gray-400 leading-relaxed">
                  <svg className="shrink-0 mt-0.5" width="13" height="13" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-baseline gap-3">
              <span className="text-[48px] font-black text-white leading-none">$12</span>
              <div>
                <div className="text-gray-600 text-[13px] line-through">$80</div>
                <div className="text-green-400 text-[11px] font-bold uppercase tracking-wider">85% off</div>
              </div>
            </div>
          </div>

          {/* Right — checkout form (shows first on mobile) */}
          <div className="bg-white p-10 flex flex-col justify-center order-1 md:order-2">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">Checkout</span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Encrypted
              </span>
            </div>
            <CheckoutForm />
          </div>

        </div>

        {/* Founder quote */}
        <div className="mt-12 max-w-[680px] mx-auto text-center">
          <blockquote className="text-[16px] text-gray-500 italic leading-relaxed mb-4">
            "I built ContentKit because I wanted the asset shelf I never had on day one — clips, ebooks, templates, and the tools to sell them. No fluff. Just the library that pays you back."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-[13px] font-bold">M</div>
            <div className="text-left">
              <div className="text-[13px] font-bold text-black">Michael</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider">Founder, ContentKit</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
