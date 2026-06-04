import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()
  if (!email || !password) return Response.json({ error: "Email and password required" }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return Response.json({ error: "Account already exists" }, { status: 409 })

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({ data: { email, name: name || email.split("@")[0], password: hashed } })
  return Response.json({ success: true })
}
