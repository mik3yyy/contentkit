import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) redirect("/sign-in")
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  if (!isDemo && !session.user?.hasPaid) redirect("/checkout")

  return (
    <div className="bg-white min-h-screen">
      <DashboardHeader userName={session.user?.name} />
      <div className="flex pt-[52px]">
        <Sidebar />
        <main className="ml-[230px] flex-1 min-h-[calc(100vh-52px)] bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}
