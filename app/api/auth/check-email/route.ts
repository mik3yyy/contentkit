import { NextRequest } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return Response.json({ exists: false })

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return Response.json({ exists: true })
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { password: true } })
  return Response.json({ exists: !!user?.password })
}
