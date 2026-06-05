"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#eeecea] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-[400px] shadow-lg border border-gray-100">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <Image src="/icon.png" alt="ContentKit" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-[17px] tracking-tight">ContentKit</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h1 className="text-[22px] font-bold text-black mb-2">Check your email</h1>
            <p className="text-[14px] text-gray-500 mb-6">
              If an account exists for <strong className="text-black">{email}</strong>, we sent a password reset link. Check your inbox.
            </p>
            <Link href="/sign-in" className="text-[14px] font-semibold text-black hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-[24px] font-bold text-black mb-1">Forgot password?</h1>
            <p className="text-[14px] text-gray-500 mb-8">Enter your email and we'll send a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold text-[14px] py-3.5 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-40"
              >
                {loading ? "Sending..." : "Send reset link →"}
              </button>
            </form>

            <p className="text-[13px] text-gray-400 mt-6 text-center">
              <Link href="/sign-in" className="text-black font-semibold hover:underline">Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
