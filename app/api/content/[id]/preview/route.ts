import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const item = await prisma.content.findUnique({ where: { id }, select: { r2Key: true } })
  if (!item) return Response.json({ error: "Not found" }, { status: 404 })

  const url = await getDownloadUrl(item.r2Key)
  return Response.json({ url })
}
