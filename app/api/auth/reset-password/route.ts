import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()
  if (!token || !password) return Response.json({ error: "Missing fields" }, { status: 400 })

  const reset = await prisma.passwordReset.findUnique({ where: { token } })

  if (!reset || reset.used || reset.expiresAt < new Date()) {
    return Response.json({ error: "This link is invalid or has expired." }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.update({ where: { email: reset.email }, data: { password: hashed } })
  await prisma.passwordReset.update({ where: { token }, data: { used: true } })

  return Response.json({ success: true })
}
