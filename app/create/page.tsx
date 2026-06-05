"use client"

import { useState, useEffect, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface FunnelStage { event: string; unique: number }
interface DayPoint    { date: string; unique: number }
interface PageRow     { page: string; views: number }
interface EventRow    { event: string; page: string | null; vid: string; ref: string | null; meta: string | null; createdAt: string }
interface Payment     { email: string; paidAt: string | null; stripePaymentId: string | null }

interface AnalyticsData {
  range: string
  unique_visitors: number
  sessions: number
  funnel: FunnelStage[]
  conversion: { visit_to_checkout: string; checkout_to_payment: string; overall: string }
  top_pages: PageRow[]
  daily_visitors: DayPoint[]
  recent_events: EventRow[]
  recent_payments: Payment[]
  total_revenue_usd: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STAGE_LABELS: Record<string, string> = {
  page_view:       "Visited site",
  pricing_view:    "Scrolled to pricing",
  cta_click:       "Clicked Get Access",
  checkout_start:  "Opened checkout",
  payment_success: "Paid",
  signup_complete: "Created account",
}

const EVENT_COLORS: Record<string, string> = {
  page_view:       "bg-blue-500",
  pricing_view:    "bg-purple-500",
  cta_click:       "bg-yellow-500",
  checkout_start:  "bg-orange-500",
  payment_success: "bg-green-500",
  signup_complete: "bg-emerald-600",
  signin:          "bg-gray-400",
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Sparkline({ data }: { data: DayPoint[] }) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.unique), 1)
  const W = 280, H = 48

  const points = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * W
    const y = H - (d.unique / max) * H
    return `${x},${y}`
  }).join(" ")

  const areaPoints = `0,${H} ${points} ${W},${H}`

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full h-12">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"   />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sg)" />
      <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Gate ─────────────────────────────────────────────────────────────────────

function Gate({ onAuth }: { onAuth: (key: string) => void }) {
  const [val, setVal] = useState("")
  const [err, setErr] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (val.trim().toLowerCase() === "mikeokpechi@gmail.com") {
      onAuth(val.trim().toLowerCase())
    } else {
      setErr(true)
      setTimeout(() => setErr(false), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        <div className="mb-10 text-center">
          <div className="w-10 h-10 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg width="18" height="18" fill="none" stroke="black" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M3 3h18v18H3z" strokeWidth="0"/><rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M8 12h8M12 8v8" strokeWidth="2"/>
            </svg>
          </div>
          <h1 className="text-white text-[20px] font-bold">ContentKit Analytics</h1>
          <p className="text-gray-500 text-[13px] mt-1">Enter your email to access</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            autoFocus
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder="your@email.com"
            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-[14px] text-white placeholder-gray-600 outline-none transition-all ${err ? "border-red-500 shake" : "border-white/10 focus:border-white/30"}`}
          />
          <button type="submit" className="w-full bg-white text-black font-bold text-[14px] py-3 rounded-xl hover:bg-gray-100 transition-colors">
            View analytics →
          </button>
          {err && <p className="text-red-400 text-[12px] text-center">Access denied.</p>}
        </form>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ adminKey }: { adminKey: string }) {
  const [data,    setData]    = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [range,   setRange]   = useState("30")

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/analytics/data?key=${encodeURIComponent(adminKey)}&range=${range}`)
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [adminKey, range])

  useEffect(() => { load() }, [load])

  // Auto-refresh every 30 s
  useEffect(() => {
    const id = setInterval(load, 30_000)
    return () => clearInterval(id)
  }, [load])

  const funnel = data?.funnel ?? []
  const maxFunnelCount = Math.max(...funnel.map(f => f.unique), 1)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <svg width="14" height="14" fill="none" stroke="black" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span className="font-bold text-[15px]">ContentKit Analytics</span>
          {loading && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />}
        </div>
        {/* Range selector */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {[["7", "7d"], ["30", "30d"], ["all", "All"]].map(([v, l]) => (
            <button key={v} onClick={() => setRange(v)}
              className={`px-3 py-1 rounded-md text-[12px] font-semibold transition-colors ${range === v ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Top stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Unique visitors", value: data ? fmt(data.unique_visitors) : "—", sub: `${range === "all" ? "all time" : `last ${range}d`}` },
            { label: "Sessions",        value: data ? fmt(data.sessions)        : "—", sub: "browser sessions" },
            { label: "Checkout opens",  value: data ? fmt(funnel.find(f => f.event === "checkout_start")?.unique  ?? 0) : "—", sub: "unique" },
            { label: "Payments",        value: data ? fmt(funnel.find(f => f.event === "payment_success")?.unique ?? 0) : "—", sub: "unique payers" },
            { label: "Revenue",         value: data ? `$${data.total_revenue_usd}` : "—", sub: "at $12/ea" },
            { label: "Overall CVR",     value: data ? data.conversion.overall : "—", sub: "visit → payment" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/8 rounded-2xl p-4">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{s.label}</div>
              <div className="text-[24px] font-black text-white leading-none mb-1">{s.value}</div>
              <div className="text-[10px] text-gray-600">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Sparkline + Conversion rates ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Daily unique visitors (last 30d)</div>
            {data ? <Sparkline data={data.daily_visitors} /> : <div className="h-12 shimmer-dark rounded" />}
            <div className="flex justify-between mt-2 text-[10px] text-gray-600">
              <span>{data?.daily_visitors[0]?.date ?? ""}</span>
              <span>{data?.daily_visitors[data.daily_visitors.length - 1]?.date ?? ""}</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Conversion rates</div>
            <div className="space-y-3">
              {[
                { label: "Visit → Checkout",  value: data?.conversion.visit_to_checkout },
                { label: "Checkout → Payment", value: data?.conversion.checkout_to_payment },
                { label: "Visit → Payment",    value: data?.conversion.overall },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-400">{r.label}</span>
                  <span className="text-[15px] font-bold text-white">{r.value ?? "—"}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-gray-600 space-y-1">
              <div>Industry avg checkout→payment: ~60–70%</div>
              <div>Industry avg visit→payment: ~1–3%</div>
            </div>
          </div>
        </div>

        {/* ── Conversion funnel ── */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-6">Conversion funnel (unique visitors per stage)</div>
          <div className="space-y-3">
            {funnel.map((stage, i) => {
              const pct = (stage.unique / maxFunnelCount) * 100
              const dropPct = i > 0 && funnel[i - 1].unique > 0
                ? (((funnel[i - 1].unique - stage.unique) / funnel[i - 1].unique) * 100).toFixed(0)
                : null
              return (
                <div key={stage.event}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-gray-300">{STAGE_LABELS[stage.event] ?? stage.event}</span>
                    <div className="flex items-center gap-3">
                      {dropPct && <span className="text-[11px] text-red-400">−{dropPct}%</span>}
                      <span className="text-[13px] font-bold text-white w-12 text-right">{fmt(stage.unique)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, opacity: 1 - i * 0.08 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Recent payments + Top pages ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Payments */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Recent payments ({data?.recent_payments.length ?? 0})
            </div>
            {!data?.recent_payments.length ? (
              <p className="text-[13px] text-gray-600">No payments yet.</p>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                {data.recent_payments.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <div className="text-[13px] font-medium text-white">{p.email}</div>
                      <div className="text-[10px] text-gray-500">{p.paidAt ? new Date(p.paidAt).toLocaleString() : "—"}</div>
                    </div>
                    <div className="text-[13px] font-bold text-green-400">$12</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top pages */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Top pages</div>
            {!data?.top_pages.length ? (
              <p className="text-[13px] text-gray-600">No data yet.</p>
            ) : (
              <div className="space-y-2">
                {data.top_pages.map((p, i) => {
                  const maxViews = data.top_pages[0]?.views ?? 1
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[12px] text-gray-300 truncate">{p.page || "/"}</span>
                          <span className="text-[12px] text-gray-500 shrink-0 ml-2">{fmt(p.views)}</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500/60 rounded-full" style={{ width: `${(p.views / maxViews) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Live event feed ── */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Live event feed (last 100)</div>
          </div>
          <div className="space-y-1.5 max-h-[400px] overflow-y-auto font-mono">
            {!data?.recent_events.length ? (
              <p className="text-[13px] text-gray-600">No events yet.</p>
            ) : data.recent_events.map((ev, i) => {
              const meta = ev.meta ? (() => { try { return JSON.parse(ev.meta!) } catch { return {} } })() : {}
              return (
                <div key={i} className="flex items-start gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <span className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${EVENT_COLORS[ev.event] ?? "bg-gray-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-white">{STAGE_LABELS[ev.event] ?? ev.event}</span>
                      {ev.page && <span className="text-[10px] text-gray-500">{ev.page}</span>}
                      {meta.email && <span className="text-[10px] text-green-400">{meta.email}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[9px] text-gray-600">#{ev.vid.slice(0, 8)}</span>
                      {ev.ref && <span className="text-[9px] text-gray-700 truncate max-w-[200px]">from {ev.ref.replace(/^https?:\/\//, "").slice(0, 40)}</span>}
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-600 shrink-0">{timeAgo(ev.createdAt)}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreatePage() {
  const [adminKey, setAdminKey] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("_ck_admin_key")
    if (stored) setAdminKey(stored)
  }, [])

  const handleAuth = (key: string) => {
    sessionStorage.setItem("_ck_admin_key", key)
    setAdminKey(key)
  }

  if (!adminKey) return <Gate onAuth={handleAuth} />
  return <Dashboard adminKey={adminKey} />
}
