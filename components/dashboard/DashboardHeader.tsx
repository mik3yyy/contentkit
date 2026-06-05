import Link from "next/link"
import Image from "next/image"

export default function DashboardHeader({ userName }: { userName?: string | null }) {
  const initial = userName?.charAt(0).toUpperCase() ?? "U"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-[52px] flex items-center px-4 gap-3">
      {/* Hamburger placeholder */}
      <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 shrink-0">
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 18 18">
          <line x1="2" y1="4.5" x2="16" y2="4.5"/>
          <line x1="2" y1="9" x2="16" y2="9"/>
          <line x1="2" y1="13.5" x2="16" y2="13.5"/>
        </svg>
      </button>

      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <Image src="/icon.png" alt="ContentKit" width={28} height={28} className="rounded-lg" />
        <span className="font-semibold text-[15px] tracking-tight">ContentKit</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-[520px] mx-auto">
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-[7px]">
          <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="2.2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search videos, ebooks, niches..."
            className="bg-transparent text-[13px] text-gray-600 flex-1 outline-none placeholder-gray-400 min-w-0"
          />
          <span className="text-[11px] text-gray-400 bg-white border border-gray-200 rounded-md px-1.5 py-0.5 font-mono leading-none shrink-0">⌘K</span>
        </div>
      </div>

      {/* Avatar */}
      <div className="ml-auto w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-[13px] font-semibold cursor-pointer select-none">
        {initial}
      </div>
    </header>
  )
}
