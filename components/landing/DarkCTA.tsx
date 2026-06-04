import Link from "next/link"

export default function DarkCTA() {
  return (
    <section className="bg-[#111] py-36 text-center">
      <div className="max-w-[860px] mx-auto px-6">
        <h2 className="font-black leading-[0.93] tracking-[-0.03em] text-white" style={{ fontSize: "clamp(48px,7vw,82px)" }}>
          Open the kit.
        </h2>
        <p className="font-light italic leading-[1.0] tracking-[-0.03em] text-gray-600 mt-2 mb-10" style={{ fontSize: "clamp(48px,7vw,82px)" }}>
          Start creating.
        </p>
        <p className="text-[16px] text-gray-400 mb-10 leading-relaxed">
          100,000+ HD &amp; 4K videos · 5,000+ rebrandable bonuses ·<br />
          full commercial license · one payment, lifetime access.
        </p>
        <Link href="#pricing" className="inline-flex items-center gap-2.5 bg-white text-black font-bold text-[16px] px-10 py-5 rounded-2xl hover:bg-gray-100 transition-colors">
          Get ContentKit
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </section>
  )
}
