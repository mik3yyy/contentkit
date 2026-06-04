import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const firstName = session?.user?.name?.split(" ")[0] ?? "there"

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: {
      favorites: { include: { content: true }, take: 4, orderBy: { createdAt: "desc" } },
      downloads: { include: { content: true }, take: 5, orderBy: { createdAt: "desc" } },
    },
  })

  const totalContent = await prisma.content.count()

  return (
    <div className="max-w-[1160px] mx-auto px-8 py-8">
      {/* Hero */}
      <div className="flex items-start justify-between gap-10 mb-7">
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <span className="text-[11px] font-mono font-semibold text-gray-500 tracking-widest uppercase">Lifetime Access · Unlimited Downloads</span>
          </div>
          <h1 className="leading-[1.1]">
            <span className="text-[46px] font-bold text-gray-900">Welcome back, {firstName}.</span>
            <br />
            <span className="text-[46px] font-light italic text-gray-300">Your library is ready.</span>
          </h1>
        </div>
        {/* Stats card */}
        <div className="w-[300px] shrink-0 bg-[#0e0e0e] text-white rounded-2xl p-6">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Your Access</div>
          <h2 className="text-[22px] font-bold mb-2">Full Library Unlocked</h2>
          <p className="text-[13px] text-gray-400 mb-5 leading-relaxed">Search, preview, and download anything. No limits, no expiry.</p>
          <Link href="/dashboard/library" className="text-[12px] text-white flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            Browse library
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 border border-gray-200 rounded-2xl overflow-hidden mb-6">
        <div className="p-5 border-r border-gray-200">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Total Content</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalContent.toLocaleString()}+</div>
          <div className="text-sm text-gray-400">videos, ebooks & more</div>
        </div>
        <div className="p-5 border-r border-gray-200">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Saved</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{user?.favorites.length ?? 0}</div>
          <div className="text-sm text-gray-400">favorites pinned</div>
        </div>
        <div className="p-5">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Downloads</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{user?.downloads.length ?? 0}</div>
          <div className="text-sm text-gray-400">files downloaded</div>
        </div>
      </div>

      {/* Favorites + Recent Downloads */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {/* Favorites */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <svg width="15" height="15" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Your Favorites</div>
                <div className="text-[13.5px] font-semibold text-gray-900">Continue where you left off</div>
              </div>
            </div>
            <Link href="/dashboard/favorites" className="text-[12px] text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors">
              Open favorites
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </Link>
          </div>
          {user?.favorites.length ? (
            <div className="flex gap-3 flex-wrap">
              {user.favorites.map((f: typeof user.favorites[0]) => (
                <div key={f.id} className="w-[115px] h-[145px] rounded-xl overflow-hidden bg-gray-800">
                  {f.content.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.content.thumbnailUrl} alt={f.content.title} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-[11px] p-2 text-center">{f.content.title}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-gray-400">No favorites yet. Browse the library and save items you love.</p>
          )}
        </div>

        {/* Recent Downloads */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <svg width="15" height="15" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Recent Downloads</div>
                <div className="text-[13.5px] font-semibold text-gray-900">Last in your vault</div>
              </div>
            </div>
            <Link href="/dashboard/downloads" className="text-[12px] text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors">
              Open downloads
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </Link>
          </div>
          {user?.downloads.length ? (
            <div className="divide-y divide-gray-100">
              {user.downloads.map((d: typeof user.downloads[0]) => (
                <div key={d.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-gray-900">{d.content.title}</div>
                    <div className="text-[11px] text-gray-400 uppercase tracking-wide font-medium mt-0.5">
                      {d.content.type} · {d.content.niche}
                    </div>
                  </div>
                  <span className="text-[11.5px] text-gray-400 shrink-0 ml-3">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-gray-400">No downloads yet. <Link href="/dashboard/library" className="text-black underline">Browse the library</Link> to get started.</p>
          )}
        </div>
      </div>

      {/* Browse CTA */}
      <div className="border border-gray-200 rounded-2xl p-6 text-center">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">New This Week</p>
        <h2 className="text-[24px] font-bold text-black mb-2">Fresh assets just added</h2>
        <p className="text-[15px] text-gray-500 mb-5">New videos and ebooks are added every week — all yours at no extra charge.</p>
        <Link href="/dashboard/library" className="inline-flex items-center gap-2 bg-black text-white font-semibold text-[14px] px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors">
          Open library
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}
