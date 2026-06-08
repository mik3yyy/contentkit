"use client"

import { useState } from "react"

export default function FreeSampleCTA() {
  const [email,    setEmail]    = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [done,     setDone]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/sample-pack/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error("Could not save email")
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    // Trigger the zip download by navigating to the API route
    window.location.href = "/api/sample-pack"
    setDone(true)
    setLoading(false)
  }

  return (
    <section className="bg-[#eeecea] py-16 md:py-24">
      <div className="max-w-[720px] mx-auto px-6 text-center">

        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-400 mb-5">
          Free Sample Pack
        </p>

        <h2 className="text-[28px] sm:text-[38px] md:text-[50px] font-black tracking-tight leading-[1.05] text-black mb-4">
          Not sure yet?
          <br />
          <span className="font-light italic text-gray-400">Download 100 clips free.</span>
        </h2>

        <p className="text-[15px] md:text-[17px] text-gray-500 leading-relaxed mb-10 max-w-[540px] mx-auto">
          Get a zip with sample clips from every niche — fitness, gaming, finance, lifestyle, and more.
          One folder per category. No catch.
        </p>

        {done ? (
          <div className="inline-flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 font-semibold text-[14px] px-8 py-4 rounded-2xl">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Your download is starting…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-[480px] mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full sm:flex-1 border border-gray-300 rounded-xl px-4 py-3.5 text-[14px] text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-black transition-all bg-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto whitespace-nowrap inline-flex items-center justify-center gap-2 bg-black text-white font-bold text-[14px] px-7 py-3.5 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Preparing…
                </>
              ) : (
                <>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download free
                </>
              )}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-[13px] mt-3">{error}</p>}

        <p className="text-[11.5px] text-gray-400 mt-4 font-medium">
          Zip file · One folder per niche · Unsubscribe anytime
        </p>

      </div>
    </section>
  )
}
