import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { favorites: { include: { content: true }, orderBy: { createdAt: "desc" } } },
  })

  return (
    <div className="max-w-[1160px] mx-auto px-8 py-8">
      <h1 className="text-[28px] font-bold text-black mb-1">Favorites</h1>
      <p className="text-[14px] text-gray-500 mb-8">{user?.favorites.length ?? 0} items saved</p>

      {!user?.favorites.length ? (
        <div className="text-center py-24 border border-gray-200 rounded-2xl">
          <svg width="40" height="40" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-4">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p className="text-[16px] font-semibold text-gray-500 mb-2">No favorites yet</p>
          <p className="text-[14px] text-gray-400 mb-5">Heart any item in the library to save it here.</p>
          <Link href="/dashboard/library" className="inline-flex items-center gap-2 bg-black text-white font-semibold text-[14px] px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors">
            Browse library
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-3">
          {user.favorites.map((f: typeof user.favorites[0]) => (
            <div key={f.id} className="group cursor-pointer">
              <div className="relative rounded-xl overflow-hidden mb-2 bg-gray-900" style={{ aspectRatio: "3/4" }}>
                {f.content.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.content.thumbnailUrl} alt={f.content.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <span className="text-gray-500 text-[11px] uppercase tracking-wider">{f.content.type}</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wide bg-black/60 rounded px-1.5 py-0.5 capitalize">{f.content.niche}</span>
                </div>
              </div>
              <p className="text-[12px] font-medium text-gray-800 truncate">{f.content.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
