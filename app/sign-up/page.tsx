"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

    // Auto sign-in after registration
    const signInRes = await signIn("credentials", { email, password, callbackUrl: "/dashboard", redirect: false })
    if (signInRes?.url) {
      window.location.href = signInRes.url
    } else {
      setError("Account created. Please sign in.")
      setLoading(false)
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

        <h1 className="text-[24px] font-bold text-black mb-1">Create your account</h1>
        <p className="text-[14px] text-gray-500 mb-8">Already purchased? Set up your login here.</p>

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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
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

          {error && <p className="text-red-500 text-[13px]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold text-[14px] py-3.5 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-40 mt-2"
          >
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>

        <p className="text-[13px] text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-black font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
