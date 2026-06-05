import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { ids } = await req.json() as { ids: string[] }
  if (!Array.isArray(ids) || ids.length === 0) return Response.json({ urls: [] })
  if (ids.length > 100) return Response.json({ error: "Max 100 per batch" }, { status: 400 })

  const items = await prisma.content.findMany({
    where: { id: { in: ids } },
    select: { id: true, r2Key: true },
  })

  const urls = await Promise.all(
    items.map(async item => ({
      id:  item.id,
      url: await getDownloadUrl(item.r2Key),
    }))
  )

  return Response.json({ urls })
}
