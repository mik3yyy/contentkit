export default function ForCreatorsResellers() {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 md:gap-16 items-start py-14 md:py-20 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
              <svg width="17" height="17" fill="none" stroke="#374151" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">01</p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">For Creators</p>
            </div>
          </div>
          <div>
            <h2 className="text-[32px] md:text-[40px] font-bold leading-tight tracking-tight text-black mb-3">Never run out of content again.</h2>
            <p className="text-[16px] text-gray-500 leading-relaxed">Stay consistent without burnout. Plug-and-play HD videos and ebooks to grow your brand and save hours every week.</p>
          </div>
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 md:gap-16 items-start py-14 md:py-20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
              <svg width="17" height="17" fill="none" stroke="#374151" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">02</p>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">For Resellers</p>
            </div>
          </div>
          <div>
            <h2 className="text-[32px] md:text-[40px] font-bold leading-tight tracking-tight text-black mb-3">A complete resell pack worth thousands.</h2>
            <p className="text-[16px] text-gray-500 leading-relaxed">Full resell rights — flip it, sell niche bundles, or package your own offers. Keep 100% of every sale.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
