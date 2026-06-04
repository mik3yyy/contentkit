"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? "Payment failed")
      setLoading(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/sign-in?callbackUrl=/dashboard`,
      },
    })

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400">Payment</span>
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-300">Stripe</span>
        </div>
        <PaymentElement options={{ layout: "accordion" }} />
      </div>
      {error && <p className="text-red-500 text-[12px] mt-3">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full mt-5 bg-black text-white font-bold text-[14px] py-4 rounded-2xl hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        {loading ? "Processing..." : "Pay & unlock the vault →"}
      </button>
      <div className="flex items-center justify-center gap-4 mt-3 text-[10.5px] text-gray-400 font-medium">
        <span>Secure · 256-bit</span>
        <span>·</span>
        <span>Encrypted payments</span>
        <span>·</span>
        <span>30-day refund</span>
      </div>
    </form>
  )
}

export default function CheckoutForm() {
  const [email, setEmail] = useState("")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    const res = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setClientSecret(data.clientSecret)
    setEmailSubmitted(true)
    setLoading(false)
  }

  if (!emailSubmitted) {
    return (
      <form onSubmit={handleEmailSubmit}>
        <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">
          Email
        </label>
        <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-3 gap-2.5 mb-5 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
          <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="contact@example.com"
            className="flex-1 text-[13.5px] text-gray-800 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-bold text-[14px] py-4 rounded-2xl hover:bg-gray-900 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          {loading ? "Loading..." : "Continue to payment →"}
        </button>
        <div className="flex items-center justify-center gap-4 mt-3 text-[10.5px] text-gray-400 font-medium">
          <span>Secure · 256-bit</span>
          <span>·</span>
          <span>Encrypted payments</span>
          <span>·</span>
          <span>30-day refund</span>
        </div>
      </form>
    )
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <PaymentForm />
    </Elements>
  )
}
