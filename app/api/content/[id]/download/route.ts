import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
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

  const name = content.title.replace(/#\S+/g, "").replace(/[^a-zA-Z0-9 \-_]/g, "").trim()
  const filename = name + (content.type === "ebook" ? ".pdf" : ".mp4")
  const url = await getDownloadUrl(content.r2Key, filename)
  return Response.json({ url })
}
