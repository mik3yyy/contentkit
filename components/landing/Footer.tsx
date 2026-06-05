import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-[#eeecea] py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-1">
              <Image src="/icon.png" alt="ContentKit" width={28} height={28} className="rounded-lg" />
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
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 sm:justify-between text-[12px] text-gray-400">
          <span>A <span className="font-semibold text-gray-500">House of Michaels</span> product</span>
          <span>© 2026 ContentKit. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
