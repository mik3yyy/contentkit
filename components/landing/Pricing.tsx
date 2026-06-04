import CheckoutForm from "@/app/checkout/CheckoutForm"

const FEATURES = [
  "100,000+ HD & 4K videos across 50+ niches",
  "5,000+ ebooks & guides (fully rebrandable)",
  "Templates, presets & sound packs",
  "Full commercial + resell rights",
  "Instant access — download everything today",
  "New content added weekly, free forever",
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#0e0e0e] py-24">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center border border-white/10 rounded-full px-4 py-1 mb-6">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em]">Pricing</span>
          </div>
          <h2 className="text-[42px] font-black tracking-tight text-white mb-2">One payment. Open the vault forever.</h2>
          <div className="flex items-center justify-center gap-6 text-[13px] text-gray-500 mt-3">
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Pay once
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Open the vault
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
          {/* Left: product info */}
          <div className="bg-[#161616] p-10 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-300">Lifetime Access</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">7-day refund</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Instant access</span>
              </div>
            </div>

            <h3 className="text-[32px] font-black text-white leading-tight mb-2">
              ContentKit <span className="italic font-light text-gray-400">Lifetime</span>
            </h3>
            <p className="text-[14px] text-gray-400 mb-8 leading-relaxed">
              The full content shelf — videos, rebrandable products, commercial rights, and lifetime updates. Buy once, use forever.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { number: "100K+", label: "HD & 4K clips" },
                { number: "5,000+", label: "Rebrandable products" },
                { number: "50+", label: "Niches" },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-2xl p-4">
                  <div className="text-[22px] font-black text-white">{s.number}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <ul className="space-y-3 mb-10 flex-1">
              {FEATURES.map(f => (
                <li key={f} className="flex items-start gap-3 text-[13.5px] text-gray-300">
                  <svg className="shrink-0 mt-0.5" width="14" height="14" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex items-baseline gap-3 mt-auto">
              <span className="text-[52px] font-black text-white leading-none">$97</span>
              <div>
                <div className="text-gray-500 text-[13px] line-through">$297</div>
                <div className="text-green-400 text-[12px] font-semibold">67% off</div>
              </div>
            </div>
          </div>

          {/* Right: checkout form */}
          <div className="bg-white p-10 flex flex-col justify-center">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </section>
  )
}
