import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[58px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.png" alt="ContentKit" width={30} height={30} className="rounded-lg shrink-0" />
          <span className="font-bold text-[16px] tracking-tight">ContentKit</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link href="#niches"       className="text-[14px] text-gray-600 hover:text-black transition-colors">Niches</Link>
          <Link href="#whats-inside" className="text-[14px] text-gray-600 hover:text-black transition-colors">Browse content</Link>
          <Link href="#pricing"      className="text-[14px] text-gray-600 hover:text-black transition-colors">Pricing</Link>
          <Link href="#faq"          className="text-[14px] text-gray-600 hover:text-black transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="hidden sm:block text-[14px] text-gray-600 hover:text-black transition-colors">Sign in</Link>
          <Link href="#pricing" className="flex items-center gap-1.5 bg-black text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors whitespace-nowrap">
            Get ContentKit
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
