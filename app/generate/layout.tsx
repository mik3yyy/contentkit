import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default async function GenerateLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/sign-in?callbackUrl=/generate")

  return (
    <div className="min-h-screen bg-[#0B0B10] text-white">
      <header className="h-14 flex items-center px-5 gap-3 border-b border-white/10">
        <Link href="/generate" className="flex items-center gap-2">
          <Image src="/icon.png" alt="ContentKit" width={24} height={24} className="rounded-md" />
          <span className="font-semibold text-[14px] tracking-tight">
            ContentKit <span className="text-indigo-400">AI</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4 text-[13px] text-white/60">
          <Link href="/dashboard" className="hover:text-white transition-colors">Back to library</Link>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
            <button className="hover:text-white transition-colors">Sign out</button>
          </form>
        </div>
      </header>
      <main className="min-h-[calc(100vh-56px)]">{children}</main>
    </div>
  )
}
