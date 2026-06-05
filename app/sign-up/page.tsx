"use client"

import { useState, Suspense, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

function SetupForm() {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const piId          = searchParams.get("payment_intent")
  const emailParam    = searchParams.get("email") ?? ""

  const [name,       setName]       = useState("")
  const [email,      setEmail]      = useState(emailParam)
  const [password,   setPassword]   = useState("")
  const [loading,    setLoading]    = useState(false)
  const [verifying,  setVerifying]  = useState(!!piId)
  const [error,      setError]      = useState("")

  // As soon as the user lands here, verify the payment with Stripe directly.
  // This sets hasPaid on the DB immediately so registration doesn't race the webhook.
  // It also returns the canonical email from the payment intent (auto-fills the field).
  useEffect(() => {
    if (!piId) return

    fetch(`/api/stripe/verify-payment?payment_intent=${piId}`)
      .then(r => r.json())
      .then(data => {
        if (data.email) setEmail(data.email)
        setVerifying(false)
      })
      .catch(() => setVerifying(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [piId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    })

    if (signInRes?.url) {
      window.location.href = signInRes.url
    } else {
      setError("Account created. Please sign in.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eeecea] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 w-full max-w-[420px] shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-black transition-colors"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/icon.png" alt="ContentKit" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-[17px] tracking-tight">ContentKit</span>
          </Link>
        </div>

        {piId && (
          <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-5">
            <svg width="12" height="12" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[11px] font-semibold text-green-700">Payment confirmed</span>
          </div>
        )}

        <h1 className="text-[24px] font-bold text-black mb-1">Set up your account</h1>
        <p className="text-[14px] text-gray-500 mb-8">
          {piId
            ? "Your payment went through. Create a password to access your library."
            : "Enter the email you paid with and create a password."}
        </p>

        {verifying ? (
          <div className="flex flex-col items-center py-10 gap-3 text-gray-400">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span className="text-[13px]">Confirming your payment…</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Email {piId ? "(pre-filled from your payment)" : "used for payment"}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full border rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${piId && email ? "border-green-200 bg-green-50 text-green-800" : "border-gray-200"}`}
              />
              {piId && email && (
                <p className="text-[10.5px] text-green-600 mt-1">Verified from your Stripe payment</p>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Create a password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-600">
                {error}
                {error.includes("No purchase found") && (
                  <p className="mt-1 text-[12px]">
                    Make sure you&apos;re using the same email you entered during checkout.{" "}
                    <Link href="/#pricing" className="underline font-semibold">Go back to checkout</Link>
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold text-[14px] py-3.5 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-40 mt-2"
            >
              {loading ? "Setting up..." : "Access my library →"}
            </button>
          </form>
        )}

        <p className="text-[13px] text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-black font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SetupForm />
    </Suspense>
  )
}
