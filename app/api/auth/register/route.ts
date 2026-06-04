import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()
  if (!email || !password) return Response.json({ error: "Email and password required" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })

  // In demo mode skip the payment check
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

  if (!isDemo && !user?.hasPaid) {
    return Response.json(
      { error: "No purchase found for this email. Please complete payment first." },
      { status: 403 }
    )
  }

  if (user?.password) {
    return Response.json({ error: "Account already exists. Please sign in." }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.upsert({
    where: { email },
    update: { password: hashed, name: name || user?.name || email.split("@")[0] },
    create: { email, name: name || email.split("@")[0], password: hashed, hasPaid: isDemo },
  })

  return Response.json({ success: true })
}
