import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#eeecea] py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                <svg width="13" height="13" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <span className="font-bold text-[15px]">ContentKit</span>
            </Link>
            <p className="text-[11px] text-gray-400 mb-4">
              by{" "}
              <a href="https://houseofmichaels.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-500 hover:text-black transition-colors">
                House of Michaels
              </a>
            </p>
            <p className="text-[13px] text-gray-500 leading-relaxed">100,000+ viral videos and 5,000+ digital products. One payment, lifetime access.</p>
          </div>
          <div>
            <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</p>
            <ul className="space-y-2.5">
              {[["Home","/"],["Pricing","#pricing"],["What's inside","#whats-inside"],["FAQ","#faq"]].map(([label, href]) => (
                <li key={label}><Link href={href} className="text-[14px] text-gray-600 hover:text-black transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Account</p>
            <ul className="space-y-2.5">
              {[["Sign in","/sign-in"],["Dashboard","/dashboard"]].map(([label, href]) => (
                <li key={label}><Link href={href} className="text-[14px] text-gray-600 hover:text-black transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Legal</p>
            <ul className="space-y-2.5">
              {[["Privacy","/privacy"],["Terms","/terms"],["Refund policy","/refund"]].map(([label, href]) => (
                <li key={label}><Link href={href} className="text-[14px] text-gray-600 hover:text-black transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex items-center justify-between text-[12px] text-gray-400">
          <span>A <span className="font-semibold text-gray-500">House of Michaels</span> product</span>
          <span>© 2026 ContentKit. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
