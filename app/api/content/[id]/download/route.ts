import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!session.user.hasPaid) {
    return Response.json({ error: "Payment required" }, { status: 403 })
  }

  const { id } = await params
  const content = await prisma.content.findUnique({ where: { id } })
  if (!content) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  await prisma.download.create({
    data: { userId: user.id, contentId: content.id },
  })

  const url = await getDownloadUrl(content.r2Key)
  return Response.json({ url })
}
