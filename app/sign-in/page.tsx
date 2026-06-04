"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"email" | "password">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [noAccount, setNoAccount] = useState(false)

  const handleEmailNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setNoAccount(false)

    const res = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setLoading(false)

    if (!data.exists) {
      setNoAccount(true)
      return
    }
    setStep("password")
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", { email, password, callbackUrl, redirect: false })
    if (res?.error) {
      setError("Incorrect password. Try again or reset it below.")
      setLoading(false)
    } else if (res?.url) {
      window.location.href = res.url
    }
  }

  return (
    <div className="min-h-screen bg-[#eeecea] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-[400px] shadow-lg border border-gray-100">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <span className="font-bold text-[17px] tracking-tight">ContentKit</span>
        </Link>

        <h1 className="text-[24px] font-bold text-black mb-1">Welcome back</h1>
        <p className="text-[14px] text-gray-500 mb-8">Sign in to access your content library.</p>

        {step === "email" ? (
          <form onSubmit={handleEmailNext} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => { setEmail(e.target.value); setNoAccount(false) }}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                autoFocus
              />
            </div>

            {noAccount && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-[13px] font-semibold text-amber-800 mb-1">No account found</p>
                <p className="text-[13px] text-amber-700">
                  This email hasn&apos;t purchased ContentKit yet.{" "}
                  <Link href="/#pricing" className="font-bold underline">Get access →</Link>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold text-[14px] py-3.5 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-40"
            >
              {loading ? "Checking..." : "Continue →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-2">
              <span className="text-[13px] text-gray-600 flex-1 truncate">{email}</span>
              <button type="button" onClick={() => { setStep("email"); setError("") }} className="text-[12px] text-gray-400 hover:text-black font-medium">
                Change
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                autoFocus
              />
            </div>

            {error && <p className="text-red-500 text-[13px]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold text-[14px] py-3.5 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-40"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>

            <p className="text-center">
              <Link href="/forgot-password" className="text-[13px] text-gray-400 hover:text-black transition-colors">
                Forgot password?
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default function SignInPage() {
  return <Suspense><SignInForm /></Suspense>
}
