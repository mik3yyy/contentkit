// Client-side analytics tracker — call track() from any client component.
// Uses sendBeacon so events fire even when the page is closing.

export function track(event: string, meta?: Record<string, unknown>) {
  if (typeof window === "undefined") return
  try {
    let vid = localStorage.getItem("_ck_vid")
    if (!vid) { vid = crypto.randomUUID(); localStorage.setItem("_ck_vid", vid) }

    let sid = sessionStorage.getItem("_ck_sid")
    if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem("_ck_sid", sid) }

    const payload = JSON.stringify({
      event,
      vid,
      sid,
      page: window.location.pathname,
      ref:  document.referrer || undefined,
      ua:   navigator.userAgent,
      meta: meta ? JSON.stringify(meta) : undefined,
    })

    const blob = new Blob([payload], { type: "application/json" })
    if (!navigator.sendBeacon("/api/analytics/track", blob)) {
      fetch("/api/analytics/track", { method: "POST", body: blob, keepalive: true }).catch(() => {})
    }
  } catch {
    // never throw — analytics must never break the app
  }
}
