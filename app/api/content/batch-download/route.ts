import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { ids } = await req.json() as { ids: string[] }
  if (!Array.isArray(ids) || ids.length === 0) return Response.json({ error: "No ids" }, { status: 400 })
  if (ids.length > 200) return Response.json({ error: "Max 200 per batch" }, { status: 400 })

  const items = await prisma.content.findMany({
    where: { id: { in: ids } },
    select: { id: true, r2Key: true, title: true, type: true },
  })

  const urls = await Promise.all(
    items.map(async item => ({
      id:    item.id,
      title: item.title,
      type:  item.type,
      url:   await getDownloadUrl(item.r2Key),
    }))
  )

  // Log downloads
  const user = await prisma.user.findUnique({ where: { email: session.user.email! }, select: { id: true } })
  if (user) {
    await prisma.download.createMany({
      data: items.map(item => ({ userId: user.id, contentId: item.id })),
      skipDuplicates: true,
    })
  }

  return Response.json({ urls })
}
