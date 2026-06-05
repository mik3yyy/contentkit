import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardShell from "@/components/dashboard/DashboardShell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) redirect("/sign-in")
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  if (!isDemo && !session.user?.hasPaid) redirect("/checkout")

  return (
    <DashboardShell userName={session.user?.name}>
      {children}
    </DashboardShell>
  )
}
