"use client"

import { useState } from "react"

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/create-checkout-session", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? "Something went wrong. Please try again.")
        setLoading(false)
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 text-white font-semibold text-[14px] rounded-xl py-3 transition-colors"
      >
        {loading ? "Redirecting…" : "Subscribe — $19/mo"}
      </button>
      {error && <p className="text-red-400 text-[12px] mt-2">{error}</p>}
    </div>
  )
}
