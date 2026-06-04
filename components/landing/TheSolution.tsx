import Link from "next/link"

const APPS = [
  { name: "TikTok",          icon: "https://cdn.simpleicons.org/tiktok/ffffff",          bg: "#010101" },
  { name: "Instagram",       icon: "https://cdn.simpleicons.org/instagram/ffffff",       bg: "#E1306C" },
  { name: "YouTube",         icon: "https://cdn.simpleicons.org/youtube/ffffff",         bg: "#FF0000" },
  { name: "Canva",           icon: "https://cdn.simpleicons.org/canva/ffffff",           bg: "#00C4CC" },
  { name: "DaVinci Resolve", icon: "https://cdn.simpleicons.org/davinciresolve/ffffff",  bg: "#233A51" },
  { name: "Snapchat",        icon: "https://cdn.simpleicons.org/snapchat/000000",        bg: "#FFFC00" },
  { name: "Pinterest",       icon: "https://cdn.simpleicons.org/pinterest/ffffff",       bg: "#E60023" },
  { name: "Facebook",        icon: "https://cdn.simpleicons.org/facebook/ffffff",        bg: "#1877F2" },
  { name: "X",               icon: "https://cdn.simpleicons.org/x/ffffff",              bg: "#000000" },
  { name: "Shopify",         icon: "https://cdn.simpleicons.org/shopify/ffffff",         bg: "#96BF48" },
  { name: "LinkedIn",        icon: "https://cdn.simpleicons.org/linkedin/ffffff",        bg: "#0A66C2" },
  { name: "Twitch",          icon: "https://cdn.simpleicons.org/twitch/ffffff",          bg: "#9146FF" },
  { name: "Discord",         icon: "https://cdn.simpleicons.org/discord/ffffff",         bg: "#5865F2" },
  { name: "Patreon",         icon: "https://cdn.simpleicons.org/patreon/ffffff",         bg: "#FF424D" },
  { name: "Etsy",            icon: "https://cdn.simpleicons.org/etsy/ffffff",            bg: "#F1641E" },
  { name: "Gumroad",         icon: "https://cdn.simpleicons.org/gumroad/ffffff",         bg: "#36A9AE" },
  { name: "Ko-fi",           icon: "https://cdn.simpleicons.org/kofi/ffffff",            bg: "#FF5E5B" },
  { name: "Notion",          icon: "https://cdn.simpleicons.org/notion/ffffff",          bg: "#000000" },
  { name: "Figma",           icon: "https://cdn.simpleicons.org/figma/ffffff",           bg: "#F24E1E" },
  { name: "WhatsApp",        icon: "https://cdn.simpleicons.org/whatsapp/ffffff",        bg: "#25D366" },
  { name: "Telegram",        icon: "https://cdn.simpleicons.org/telegram/ffffff",        bg: "#26A5E4" },
  { name: "Substack",        icon: "https://cdn.simpleicons.org/substack/ffffff",        bg: "#FF6719" },
  { name: "Stripe",          icon: "https://cdn.simpleicons.org/stripe/ffffff",          bg: "#635BFF" },
  { name: "Threads",         icon: "https://cdn.simpleicons.org/threads/ffffff",         bg: "#000000" },
  { name: "Beehiiv",         icon: "https://cdn.simpleicons.org/convertkit/ffffff",      bg: "#FB6970" },
  { name: "WooCommerce",     icon: "https://cdn.simpleicons.org/woocommerce/ffffff",     bg: "#96588A" },
  { name: "Mailchimp",       icon: "https://cdn.simpleicons.org/mailchimp/ffffff",       bg: "#FFE01B" },
]

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=90&h=130&fit=crop&q=60",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=90&h=130&fit=crop&q=60",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=90&h=130&fit=crop&q=60",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=90&h=130&fit=crop&q=60",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=90&h=130&fit=crop&q=60",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=90&h=130&fit=crop&q=60",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=90&h=130&fit=crop&q=60",
]

export default function TheSolution() {
  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="pt-4">
            <div className="inline-flex items-center border border-gray-200 rounded-full px-4 py-1 mb-8">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">The Solution</span>
            </div>
            <h2 className="font-black leading-[0.93] tracking-tight text-black mb-2" style={{ fontSize: "clamp(32px,4vw,52px)" }}>
              The entire content library.
            </h2>
            <p className="font-light italic leading-[1.05] tracking-tight text-gray-300 mb-8" style={{ fontSize: "clamp(32px,4vw,52px)" }}>
              All of it, upfront. No subscription.
            </p>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-4">
              <strong className="text-black font-semibold">Luxury, fitness, money, travel, food, gaming, motivation, nature.</strong>{" "}
              Search by keyword, filter by niche, preview before you download. ContentKit is a platform, not a Google Drive folder.
            </p>
            <p className="text-[15px] text-gray-700 leading-relaxed mb-10">
              Stop filming. <strong className="font-semibold">Start posting.</strong> Full commercial license — use on theme pages, run as paid ads, or repackage and resell. No attribution, no royalties.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#pricing" className="flex items-center gap-2 bg-black text-white font-semibold text-[14px] px-6 py-3.5 rounded-xl hover:bg-gray-900 transition-colors">
                Get ContentKit
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <Link href="#whats-inside" className="flex items-center gap-2 border border-gray-300 text-black font-semibold text-[14px] px-6 py-3.5 rounded-xl hover:border-gray-500 transition-colors">
                Browse content
              </Link>
            </div>
          </div>

          {/* Right: browser mockup */}
          <div className="relative">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-300" />)}
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 text-[11px] text-gray-400 text-center">contentkit.io/library</div>
              </div>
              <div className="flex" style={{ height: 310 }}>
                {/* Sidebar */}
                <div className="w-36 bg-white border-r border-gray-100 p-3 shrink-0">
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="w-5 h-5 bg-black rounded" />
                    <span className="text-[11px] font-bold">ContentKit</span>
                  </div>
                  {[["Clips","183k",true],["Ebooks","5k",false],["Guides","2k",false],["Templates","",false],["Audio","140",false]].map(([label, count, active]) => (
                    <div key={String(label)} className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 mb-0.5 ${active ? "bg-black text-white" : ""}`}>
                      <div className={`w-2 h-2 rounded-sm shrink-0 ${active ? "bg-white/20" : "bg-gray-200"}`} />
                      <span className={`text-[9.5px] font-medium ${active ? "" : "text-gray-500"}`}>{String(label)}</span>
                      {count && <span className={`ml-auto text-[8px] ${active ? "text-white/50" : "text-gray-400"}`}>{String(count)}</span>}
                    </div>
                  ))}
                </div>
                {/* Grid */}
                <div className="flex-1 p-3 overflow-hidden">
                  <p className="text-[8px] text-gray-400 mb-2 uppercase tracking-wider">100,000+ results</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {MOCK_IMAGES.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={src} alt="" className="rounded-lg object-cover w-full" style={{ height: 76 }} />
                    ))}
                    <div className="rounded-lg bg-black flex items-center justify-center" style={{ height: 76 }}>
                      <div className="text-center"><div className="text-white text-[8px] font-bold">100K+</div><div className="text-gray-400 text-[7px]">READY</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-3 right-0 translate-x-2 bg-black text-white rounded-xl px-3 py-2 text-[10px] font-semibold flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              100K+ Ready-to-post
            </div>
          </div>
        </div>
      </div>

      {/* Works with — infinite marquee */}
      <div className="max-w-[1100px] mx-auto px-6 mt-16 pt-10 border-t border-gray-100">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-8">Works with</p>
      </div>
      <div
        className="overflow-hidden w-full"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
          <div className="marquee" style={{ gap: 32 }}>
            {[...APPS, ...APPS].map((app, i) => (
              <div key={i} className="flex items-center gap-2.5 shrink-0">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: app.bg }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={app.icon} alt={app.name} width={17} height={17} />
                </div>
                <span className="text-[13.5px] font-semibold text-gray-500 whitespace-nowrap">{app.name}</span>
              </div>
            ))}
          </div>
        </div>
    </section>
  )
}
