import { NextRequest } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return Response.json({ error: "Demo mode is not enabled" }, { status: 403 })
  }

  const { email } = await req.json()
  if (!email) return Response.json({ error: "Email required" }, { status: 400 })

  await prisma.user.upsert({
    where: { email },
    update: { hasPaid: true, paidAt: new Date() },
    create: { email, hasPaid: true, paidAt: new Date() },
  })

  return Response.json({ success: true })
}
