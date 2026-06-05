"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import { signOut } from "next-auth/react"
import { Suspense } from "react"

// ─── Icons ────────────────────────────────────────────────────────────────────

function Icon({ name }: { name: string }) {
  const p = { width: 13, height: 13, fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24" }
  switch (name) {
    case "home":     return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    case "library":  return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
    case "clip":     return <svg {...p}><polygon points="5 3 19 12 5 21 5 3"/></svg>
    case "scissors": return <svg {...p}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
    case "book":     return <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    case "compass":  return <svg {...p}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
    case "layout":   return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
    case "message":  return <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    case "tool":     return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
    case "sliders":  return <svg {...p}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
    case "music":    return <svg {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    case "heart":    return <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    case "download": return <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    case "settings": return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    case "signout":  return <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    case "help":     return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    default:         return null
  }
}

// ─── Library types ────────────────────────────────────────────────────────────

const LIBRARY_TYPES = [
  { label: "Clips",       type: "video",       icon: "clip"     },
  { label: "Clip picker", type: "clip-picker",  icon: "scissors" },
  { label: "Ebooks",      type: "ebook",        icon: "book"     },
  { label: "Guides",      type: "guide",        icon: "compass"  },
  { label: "Templates",   type: "template",     icon: "layout"   },
  { label: "Prompts",     type: "prompt",       icon: "message"  },
  { label: "Tools",       type: "tool",         icon: "tool"     },
  { label: "Presets",     type: "preset",       icon: "sliders"  },
  { label: "Audio",       type: "audio",        icon: "music"    },
]

// ─── Sidebar nav (inner, needs hooks) ────────────────────────────────────────

function SidebarNav({ onClose }: { onClose: () => void }) {
  const pathname   = usePathname()
  const params     = useSearchParams()
  const activeType = params.get("type")
  const onLibrary  = pathname.startsWith("/dashboard/library")

  const nav = (href: string) => {
    onClose()
    return href
  }

  return (
    <nav className="flex-1 px-2.5 py-4">
      <Link href={nav("/dashboard")}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-1 transition-colors ${pathname === "/dashboard" && !onLibrary ? "bg-black text-white font-medium" : "text-gray-700 hover:bg-gray-50"}`}
        onClick={onClose}>
        <Icon name="home" />Home
      </Link>

      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-2 mt-5 mb-1.5">Library</span>

      <Link href="/dashboard/library?type=video"
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-0.5 transition-colors ${onLibrary ? "bg-black text-white font-medium" : "text-gray-700 hover:bg-gray-50"}`}
        onClick={onClose}>
        <Icon name="library" />Library
      </Link>

      <div className="ml-3 border-l border-gray-100 pl-2.5 mb-1">
        {LIBRARY_TYPES.map(({ label, type, icon }) => {
          const active = onLibrary && activeType === type
          return (
            <Link key={type} href={`/dashboard/library?type=${type}`}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12.5px] transition-colors mb-0.5 ${active ? "bg-black text-white font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-black"}`}
              onClick={onClose}>
              <Icon name={icon} />{label}
            </Link>
          )
        })}
      </div>

      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-2 mt-4 mb-1.5">Personal</span>
      {[
        { href: "/dashboard/favorites", icon: "heart",    label: "Favourites" },
        { href: "/dashboard/downloads", icon: "download", label: "Downloads"  },
      ].map(item => (
        <Link key={item.href} href={item.href}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors mb-0.5 ${pathname === item.href ? "bg-black text-white font-medium" : "text-gray-700 hover:bg-gray-50"}`}
          onClick={onClose}>
          <Icon name={item.icon} />{item.label}
        </Link>
      ))}

      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-2 mt-4 mb-1.5">Account</span>
      <Link href="/dashboard/settings"
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors mb-0.5 ${pathname === "/dashboard/settings" ? "bg-black text-white font-medium" : "text-gray-700 hover:bg-gray-50"}`}
        onClick={onClose}>
        <Icon name="settings" />Settings
      </Link>
      <Link href="/dashboard/support"
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors mb-0.5 ${pathname === "/dashboard/support" ? "bg-black text-white font-medium" : "text-gray-700 hover:bg-gray-50"}`}
        onClick={onClose}>
        <Icon name="help" />Support
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-700 hover:bg-gray-50 transition-colors w-full text-left">
        <Icon name="signout" />Sign out
      </button>
    </nav>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function DashboardShell({
  children,
  userName,
}: {
  children: React.ReactNode
  userName?: string | null
}) {
  const [open, setOpen] = useState(false)
  const initial = userName?.charAt(0).toUpperCase() ?? "U"

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-[52px] flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(o => !o)}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 shrink-0"
          aria-label="Toggle menu"
        >
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 18 18">
            <line x1="2" y1="4.5" x2="16" y2="4.5"/>
            <line x1="2" y1="9"   x2="16" y2="9"/>
            <line x1="2" y1="13.5" x2="16" y2="13.5"/>
          </svg>
        </button>

        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <Image src="/icon.png" alt="ContentKit" width={28} height={28} className="rounded-lg" />
          <span className="font-semibold text-[15px] tracking-tight hidden sm:block">ContentKit</span>
        </Link>

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
            <span className="text-[11px] text-gray-400 bg-white border border-gray-200 rounded-md px-1.5 py-0.5 font-mono leading-none shrink-0 hidden sm:block">⌘K</span>
          </div>
        </div>

        <div className="ml-auto w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-[13px] font-semibold cursor-pointer select-none shrink-0">
          {initial}
        </div>
      </header>

      <div className="flex pt-[52px]">
        {/* Mobile backdrop */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed left-0 top-[52px] bottom-0 w-[220px] border-r border-gray-100 bg-white flex flex-col z-40 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}>
          <Suspense>
            <SidebarNav onClose={() => setOpen(false)} />
          </Suspense>

          <div className="mx-2.5 mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-[11px] font-semibold text-gray-800 mb-0.5">Lifetime access</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">Unlimited downloads · New content weekly</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-[220px] min-h-[calc(100vh-52px)] bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}
