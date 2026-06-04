"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const NAV = [
  {
    label: "BROWSE",
    items: [{ href: "/dashboard", icon: "home", label: "Home" }],
  },
  {
    label: "LIBRARY",
    items: [{ href: "/dashboard/library", icon: "grid", label: "Library" }],
  },
  {
    label: "WORKSPACE",
    items: [
      { href: "/dashboard/favorites", icon: "heart", label: "Favorites" },
      { href: "/dashboard/downloads", icon: "download", label: "Downloads" },
    ],
  },
]

function Icon({ name }: { name: string }) {
  const props = { width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24" }
  switch (name) {
    case "home":    return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    case "grid":    return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
    case "heart":   return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    case "download":return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    case "settings":return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    case "signout": return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    default:        return null
  }
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-[52px] bottom-0 w-[230px] border-r border-gray-100 bg-white flex flex-col z-40 overflow-y-auto">
      <nav className="flex-1 px-2.5 py-3">
        {NAV.map(section => (
          <div key={section.label}>
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-2 mt-5 mb-1">{section.label}</span>
            {section.items.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] transition-colors ${
                    active ? "bg-black text-white font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}

        {/* Account */}
        <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-2 mt-5 mb-1">Account</span>
        <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] text-gray-700 hover:bg-gray-50 transition-colors">
          <Icon name="settings" />Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
        >
          <Icon name="signout" />Sign out
        </button>
      </nav>

      <div className="mx-2.5 mb-3 mt-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">ContentKit</div>
        <p className="text-[12px] text-gray-500 leading-relaxed">Your library is ready. Start downloading.</p>
      </div>
    </aside>
  )
}
