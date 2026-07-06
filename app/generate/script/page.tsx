import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import ScriptForm from "./ScriptForm"

export default async function ScriptPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/sign-in?callbackUrl=/generate/script")

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) redirect("/sign-in?callbackUrl=/generate/script")
  if (!isDemo && user.subscriptionStatus !== "active") redirect("/generate/upgrade")

  const nicheCounts = await prisma.content.groupBy({
    by: ["niche"],
    where: { type: "video", description: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  })

  const voiceoverAvailable = Boolean(process.env.OPENAI_API_KEY || process.env.ELEVENLABS_API_KEY)

  return (
    <ScriptForm
      credits={user.credits}
      niches={nicheCounts.map(n => ({ niche: n.niche, count: n._count.id }))}
      voiceoverAvailable={voiceoverAvailable}
    />
  )
}
