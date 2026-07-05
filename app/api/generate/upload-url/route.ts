import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getUploadUrl } from "@/lib/r2"
import { randomUUID } from "crypto"

const ALLOWED_TYPES = new Set(["video/mp4", "video/quicktime"])
const MAX_BYTES = 500 * 1024 * 1024 // 500MB

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Not signed in" }, { status: 401 })
  }

  const { contentType, fileSizeBytes } = await req.json()
  if (!ALLOWED_TYPES.has(contentType)) {
    return Response.json({ error: "Only .mp4 or .mov files are supported" }, { status: 400 })
  }
  if (typeof fileSizeBytes !== "number" || fileSizeBytes > MAX_BYTES) {
    return Response.json({ error: "File is too large (max 500MB)" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 })

  const ext = contentType === "video/quicktime" ? "mov" : "mp4"
  const r2Key = `generate-uploads/${user.id}/${randomUUID()}.${ext}`
  const uploadUrl = await getUploadUrl(r2Key, contentType)

  return Response.json({ uploadUrl, r2Key })
}
