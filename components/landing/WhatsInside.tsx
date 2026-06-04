const CLIP_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=180&h=280&fit=crop&q=75",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=180&h=280&fit=crop&q=75",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=180&h=280&fit=crop&q=75",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=180&h=280&fit=crop&q=75",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=180&h=280&fit=crop&q=75",
  "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=180&h=280&fit=crop&q=75",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=180&h=280&fit=crop&q=75",
]

const NICHES_TOP = [
  ["Luxury","12,400+"],["Fitness","9,800+"],["Money","8,200+"],["Travel","7,600+"],["Motivation","6,900+"],["Food","6,100+"],
]
const NICHES_BOT = [
  ["Gaming","5,400+"],["Nature","5,200+"],["Cars","4,800+"],["Business","4,600+"],["Calisthenics","3,900+"],["Animals","3,700+"],
]

const EBOOKS = [
  { label: "Interview Success Blueprint", color: "text-orange-400", bg: "from-[#1a1a2e] to-[#16213e]" },
  { label: "Email Nurture Strategy That Works", color: "text-green-400", bg: "from-[#0f0f1a] to-[#1a2a1a]" },
  { label: "Build A Brand That Sells", color: "text-yellow-400", bg: "from-[#0a0a14] to-[#1a1a0a]" },
  { label: "The Power of Mindful Mornings", color: "text-purple-400", bg: "from-[#12081a] to-[#1a0a2a]" },
]

const TEMPLATES = ["Offer Page","Welcome Email","Hook List","Content Plan","Lead Magnet","Sound Pack"]

export default function WhatsInside() {
  return (
    <section id="whats-inside" className="bg-[#eeecea] py-12">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="inline-flex items-center border border-gray-300 bg-white/50 rounded-full px-4 py-1 mb-6">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">What&apos;s Inside ContentKit</span>
        </div>
        <h2 className="font-black leading-[0.93] tracking-tight text-black" style={{ fontSize: "clamp(36px,5vw,62px)" }}>Videos are the main event.</h2>
        <p className="font-light italic leading-[1.05] tracking-tight text-gray-300 mb-10" style={{ fontSize: "clamp(36px,5vw,62px)" }}>The ebooks come free on top.</p>

        {/* Clips card */}
        <div className="bg-white rounded-3xl p-8 mb-5 border border-gray-100 shadow-sm">
          <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 mb-5">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">100,000+ Clips · The Main Event</span>
          </div>
          <h3 className="text-[30px] font-bold text-black mb-2">Faceless HD &amp; 4K clips</h3>
          <p className="text-[15px] text-gray-500 leading-relaxed mb-6 max-w-[500px]">Stream-ready 9:16 footage across 50+ niches — luxury, fitness, food, business, motivation, nature. Post-ready for TikTok, Reels, Shorts.</p>
          <div className="grid grid-cols-7 gap-2 mb-6">
            {CLIP_IMAGES.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="rounded-xl object-cover w-full" style={{ height: 175 }} />
            ))}
          </div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Top Niches by Clip Count</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {NICHES_TOP.map(([n, c]) => (
              <span key={n} className="flex items-center justify-between gap-5 border border-gray-200 rounded-lg px-3 py-2 text-[12px]">
                <span className="font-medium">{n}</span><span className="text-gray-400">{c}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {NICHES_BOT.map(([n, c]) => (
              <span key={n} className="flex items-center justify-between gap-5 border border-gray-200 rounded-lg px-3 py-2 text-[12px]">
                <span className="font-medium">{n}</span><span className="text-gray-400">{c}</span>
              </span>
            ))}
          </div>
          <p className="text-[10.5px] text-gray-400 uppercase tracking-wider font-semibold">50+ Niches Total · New Content Added Weekly</p>
        </div>

        {/* Ebooks + Templates */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 mb-5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">5,000+ Files · Bonus Included</span>
            </div>
            <h3 className="text-[26px] font-bold text-black mb-3">Ebooks &amp; guides</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6">Rebrandable PDFs you can rename and resell as your own — or give away as a freebie. Self-help, finance, wellness, productivity.</p>
            <div className="flex gap-3">
              {EBOOKS.map(({ label, color, bg }) => (
                <div key={label} className={`w-[86px] h-[112px] rounded-xl bg-gradient-to-br ${bg} flex flex-col items-center justify-center p-2.5 shrink-0`}>
                  <div className={`text-[7.5px] font-bold ${color} text-center uppercase leading-tight`}>{label}</div>
                  <div className={`mt-2 w-5 h-5 rounded-full border border-current/30 flex items-center justify-center`}>
                    <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={color}><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 mb-5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Plug-and-Play · Bonus Included</span>
            </div>
            <h3 className="text-[26px] font-bold text-black mb-3">Templates, presets &amp; sounds</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6">Lead magnets, hook lists, IG carousels, content calendars, offer pages, email templates, sound packs.</p>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <div key={t} className="border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
