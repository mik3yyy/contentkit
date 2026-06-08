import { NextRequest } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}))
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return Response.json({ error: "Valid email required" }, { status: 400 })
  }

  // Store as an analytics event so we have a lead list without a schema migration
  await prisma.analyticsEvent.create({
    data: {
      vid:   email, // use email as visitor id for lead identification
      sid:   "sample-pack",
      event: "sample_pack_download",
      meta:  JSON.stringify({ email: email.toLowerCase().trim() }),
    },
  })

  return Response.json({ ok: true })
}
