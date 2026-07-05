import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import Onboarding from "./Onboarding"
import ModePicker from "./ModePicker"

export default async function GeneratePage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/sign-in?callbackUrl=/generate")

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) redirect("/sign-in?callbackUrl=/generate")
  if (!isDemo && user.subscriptionStatus !== "active") redirect("/generate/upgrade")

  if (!user.generateOnboarding) {
    return <Onboarding />
  }

  const nicheCounts = await prisma.content.groupBy({
    by: ["niche"],
    where: { type: "video", role: "standalone" },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  })

  return (
    <ModePicker
      credits={user.credits}
      niches={nicheCounts.map(n => ({ niche: n.niche, count: n._count.id }))}
    />
  )
}
