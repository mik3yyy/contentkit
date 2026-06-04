import Link from "next/link"

export default function StickyBar() {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="flex items-center gap-5 bg-white/95 backdrop-blur border border-gray-200 rounded-2xl px-6 py-3 shadow-xl pointer-events-auto">
        <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.12em] hidden sm:block">
          Lifetime Access · Money-back Guarantee
        </span>
        <Link href="#pricing" className="flex items-center gap-2 bg-black text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors whitespace-nowrap">
          Get instant access
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}
