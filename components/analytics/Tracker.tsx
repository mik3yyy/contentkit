"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { track } from "@/lib/track"

export default function Tracker() {
  const pathname    = usePathname()
  const firedRef    = useRef<Set<string>>(new Set())

  // Page view — fires on every route change
  useEffect(() => {
    track("page_view")
  }, [pathname])

  // Pricing section visibility + CTA clicks — landing page only
  useEffect(() => {
    if (pathname !== "/") return

    // Pricing section entering viewport → pricing_view
    const pricingEl = document.getElementById("pricing")
    let pricingObserver: IntersectionObserver | null = null
    if (pricingEl) {
      pricingObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !firedRef.current.has("pricing_view")) {
            firedRef.current.add("pricing_view")
            track("pricing_view")
          }
        },
        { threshold: 0.2 }
      )
      pricingObserver.observe(pricingEl)
    }

    // CTA button clicks → cta_click
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link   = target.closest("a")
      const btn    = target.closest("button")
      const text   = (link?.textContent ?? btn?.textContent ?? "").trim().toLowerCase()
      const href   = link?.getAttribute("href") ?? ""

      if (href === "#pricing" || text.includes("get contentkit") || text.includes("get instant access") || text.includes("get access")) {
        track("cta_click", { label: text.slice(0, 60) })
      }
    }
    document.addEventListener("click", handleClick)

    return () => {
      pricingObserver?.disconnect()
      document.removeEventListener("click", handleClick)
    }
  }, [pathname])

  return null
}
