import { NextRequest } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/resend"

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return Response.json({ error: "Email required" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })

  // Always return success so we don't leak which emails exist
  if (!user || !user.password) {
    return Response.json({ success: true })
  }

  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.passwordReset.create({ data: { email, token, expiresAt } })

  const resetUrl = `${process.env.NEXTAUTH_URL ?? process.env.AUTH_URL}/reset-password?token=${token}`
  await sendPasswordResetEmail(email, resetUrl)

  return Response.json({ success: true })
}
