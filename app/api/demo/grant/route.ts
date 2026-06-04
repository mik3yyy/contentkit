import { NextRequest } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")
  if (!email) return Response.json({ error: "Email required" }, { status: 400 })

  await prisma.user.upsert({
    where: { email },
    update: { hasPaid: true, paidAt: new Date() },
    create: { email, hasPaid: true, paidAt: new Date() },
  })

  return Response.redirect(new URL("/sign-in?callbackUrl=/dashboard", req.url))
}
