import { NextRequest } from "next/server"
import { prisma } from "@/lib/db"

const ADMIN_EMAIL = process.env.ANALYTICS_ADMIN_EMAIL ?? "mikeokpechi@gmail.com"

function ago(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key")
  if (key !== ADMIN_EMAIL) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const range = req.nextUrl.searchParams.get("range") ?? "30"
  const days  = range === "all" ? 3650 : parseInt(range) || 30
  const since = ago(days)

  // ── Funnel counts (unique visitors at each stage) ──────────────────────────
  const funnelStages = ["page_view", "pricing_view", "cta_click", "checkout_start", "payment_success", "signup_complete"] as const

  const funnelData = await Promise.all(
    funnelStages.map(event =>
      prisma.analyticsEvent.groupBy({
        by: ["vid"],
        where: { event, createdAt: { gte: since } },
        _count: true,
      }).then(rows => ({ event, unique: rows.length }))
    )
  )

  // ── Unique visitors & sessions ─────────────────────────────────────────────
  const [uvRows, sessionRows] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["vid"],
      where: { event: "page_view", createdAt: { gte: since } },
      _count: true,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["sid"],
      where: { event: "page_view", createdAt: { gte: since } },
      _count: true,
    }),
  ])

  // ── Top pages ──────────────────────────────────────────────────────────────
  const pageRows = await prisma.analyticsEvent.groupBy({
    by: ["page"],
    where: { event: "page_view", createdAt: { gte: since }, page: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  })

  // ── Daily unique visitors for sparkline (last 30 days always) ─────────────
  const dailyRaw = await prisma.analyticsEvent.findMany({
    where: { event: "page_view", createdAt: { gte: ago(30) } },
    select: { vid: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  const dailyMap: Record<string, Set<string>> = {}
  for (const row of dailyRaw) {
    const d = row.createdAt.toISOString().slice(0, 10)
    if (!dailyMap[d]) dailyMap[d] = new Set()
    dailyMap[d].add(row.vid)
  }
  const dailyVisitors = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, set]) => ({ date, unique: set.size }))

  // ── Recent events feed ─────────────────────────────────────────────────────
  const recentEvents = await prisma.analyticsEvent.findMany({
    where:   { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take:    100,
    select:  { event: true, page: true, vid: true, sid: true, ref: true, meta: true, createdAt: true },
  })

  // ── Recent payments (from User table) ─────────────────────────────────────
  const recentPayments = await prisma.user.findMany({
    where:   { hasPaid: true, paidAt: { not: null } },
    orderBy: { paidAt: "desc" },
    take:    50,
    select:  { email: true, paidAt: true, stripePaymentId: true, createdAt: true },
  })

  // ── Conversion rates ───────────────────────────────────────────────────────
  const visits   = funnelData.find(f => f.event === "page_view")?.unique    ?? 0
  const checkouts = funnelData.find(f => f.event === "checkout_start")?.unique ?? 0
  const payments  = funnelData.find(f => f.event === "payment_success")?.unique ?? 0

  const pct = (n: number, d: number) => (d === 0 ? "—" : `${((n / d) * 100).toFixed(1)}%`)

  return Response.json({
    range,
    unique_visitors: uvRows.length,
    sessions:        sessionRows.length,
    funnel:          funnelData,
    conversion: {
      visit_to_checkout:  pct(checkouts, visits),
      checkout_to_payment: pct(payments, checkouts),
      overall:            pct(payments, visits),
    },
    top_pages:      pageRows.map(r => ({ page: r.page, views: r._count.id })),
    daily_visitors: dailyVisitors,
    recent_events:  recentEvents,
    recent_payments: recentPayments,
    total_revenue_usd: recentPayments.length * 12,
  })
}
