import Link from "next/link"

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
    <section id="pricing" className="bg-white py-24">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        <div className="inline-flex items-center border border-gray-200 rounded-full px-4 py-1 mb-8">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Pricing</span>
        </div>
        <h2 className="text-[48px] font-black tracking-tight text-black mb-2">One price. Everything included.</h2>
        <p className="text-[18px] text-gray-500 mb-14">No monthly fees. No drip access. No surprises.</p>

        <div className="max-w-[420px] mx-auto bg-black text-white rounded-3xl p-10 text-center shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-300">Lifetime Access</span>
          </div>
          <div className="text-[68px] font-black leading-none mb-1">$97</div>
          <div className="text-gray-500 text-[15px] mb-8 line-through">was $297</div>
          <ul className="space-y-3 text-left mb-9">
            {FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3 text-[14px]">
                <svg width="15" height="15" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/checkout" className="block w-full bg-white text-black font-bold text-[15px] py-4 rounded-2xl hover:bg-gray-100 transition-colors text-center">
            Get ContentKit →
          </Link>
          <p className="text-[12px] text-gray-600 mt-4">30-day money-back guarantee · No questions asked</p>
        </div>
      </div>
    </section>
  )
}
