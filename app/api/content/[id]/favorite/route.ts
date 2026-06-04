import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: contentId } = await params
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const existing = await prisma.favorite.findUnique({
    where: { userId_contentId: { userId: user.id, contentId } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
    return Response.json({ favorited: false })
  } else {
    await prisma.favorite.create({ data: { userId: user.id, contentId } })
    return Response.json({ favorited: true })
  }
}
