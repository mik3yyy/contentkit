import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function DownloadsPage() {
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { downloads: { include: { content: true }, orderBy: { createdAt: "desc" } } },
  })

  return (
    <div className="max-w-[1160px] mx-auto px-8 py-8">
      <h1 className="text-[28px] font-bold text-black mb-1">Downloads</h1>
      <p className="text-[14px] text-gray-500 mb-8">{user?.downloads.length ?? 0} files downloaded</p>

      {!user?.downloads.length ? (
        <div className="text-center py-24 border border-gray-200 rounded-2xl">
          <svg width="40" height="40" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <p className="text-[16px] font-semibold text-gray-500 mb-2">No downloads yet</p>
          <p className="text-[14px] text-gray-400 mb-5">Download any video or ebook from the library.</p>
          <Link href="/dashboard/library" className="inline-flex items-center gap-2 bg-black text-white font-semibold text-[14px] px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors">
            Browse library
          </Link>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_120px_80px] text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 border-b border-gray-100">
            <span>File</span><span>Type</span><span>Niche</span><span>Date</span>
          </div>
          {user.downloads.map((d: typeof user.downloads[0], i: number) => (
            <div key={d.id} className={`grid grid-cols-[1fr_120px_120px_80px] items-center px-5 py-3.5 ${i < user.downloads.length - 1 ? "border-b border-gray-100" : ""}`}>
              <span className="text-[14px] font-medium text-gray-900 truncate">{d.content.title}</span>
              <span className="text-[12px] text-gray-500 capitalize">{d.content.type}</span>
              <span className="text-[12px] text-gray-500 capitalize">{d.content.niche}</span>
              <span className="text-[12px] text-gray-400">{new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
