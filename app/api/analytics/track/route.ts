import { NextRequest } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { event, vid, sid, page, ref, ua, meta } = await req.json()
    if (!event || !vid || !sid) return Response.json({ ok: false }, { status: 400 })

    await prisma.analyticsEvent.create({
      data: {
        event: String(event).slice(0, 64),
        vid:   String(vid).slice(0, 64),
        sid:   String(sid).slice(0, 64),
        page:  page  ? String(page).slice(0, 256)  : null,
        ref:   ref   ? String(ref).slice(0, 512)   : null,
        ua:    ua    ? String(ua).slice(0, 512)     : null,
        meta:  meta  ? String(meta).slice(0, 1024)  : null,
      },
    })
  } catch {
    // silently swallow — never crash the user's session
  }

  return Response.json({ ok: true })
}
