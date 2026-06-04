"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError("Passwords don't match"); return }
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setDone(true)
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

        {!token ? (
          <div className="text-center">
            <p className="text-red-500 text-[14px] mb-4">Invalid reset link.</p>
            <Link href="/forgot-password" className="text-black font-semibold hover:underline text-[14px]">Request a new one</Link>
          </div>
        ) : done ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 className="text-[22px] font-bold text-black mb-2">Password updated</h1>
            <p className="text-[14px] text-gray-500 mb-6">Your password has been changed. You can now sign in.</p>
            <Link href="/sign-in" className="inline-block w-full bg-black text-white font-bold text-[14px] py-3.5 rounded-xl text-center hover:bg-gray-900 transition-colors">
              Sign in →
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-[24px] font-bold text-black mb-1">Set new password</h1>
            <p className="text-[14px] text-gray-500 mb-8">Choose a strong password for your account.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">New password</label>
                <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-black transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Confirm password</label>
                <input type="password" required minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-black transition-all" />
              </div>
              {error && <p className="text-red-500 text-[13px]">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-black text-white font-bold text-[14px] py-3.5 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-40">
                {loading ? "Updating..." : "Update password →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>
}
