import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const niche = searchParams.get("niche") || undefined
  const type  = searchParams.get("type")  || undefined
  const tag   = searchParams.get("tag")   || undefined
  const q     = searchParams.get("q")     || undefined

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    ...(niche && niche !== "all" ? { niche }                                        : {}),
    ...(type  && type  !== "all" ? { type  }                                        : {}),
    ...(tag                      ? { tags: { has: tag } }                           : {}),
    ...(q                        ? { title: { contains: q, mode: "insensitive" } }  : {}),
  }

  const rows = await prisma.content.findMany({
    where,
    select: { id: true },
    orderBy: { createdAt: "desc" },
  })

  return Response.json({ ids: rows.map(r => r.id) })
}
