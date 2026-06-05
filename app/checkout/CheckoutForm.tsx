"use client"

import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { track } from "@/lib/track"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ─── Real payment form ────────────────────────────────────────────────────────

function PaymentForm({ clientSecret }: { clientSecret: string }) {
  const stripe   = useStripe()
  const elements = useElements()
  const [email,   setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    if (!email) { setError("Please enter your email address."); return }

    setLoading(true)
    setError(null)

    // Validate the Elements form first
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? "Payment failed")
      setLoading(false)
      return
    }

    // Attach the email to the payment intent before confirming —
    // this is what the webhook and verify-payment endpoint read.
    try {
      const updateRes = await fetch("/api/stripe/update-payment-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientSecret, email }),
      })
      if (!updateRes.ok) throw new Error("Could not save email")
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    // redirect: 'if_required' means:
    //   - Apple Pay / Google Pay → completes inline, no redirect, we handle below
    //   - Cards with 3D Secure    → redirects to bank, then returns to return_url
    //   - Simple cards             → completes inline (most of the time)
    const returnUrl = `${window.location.origin}/sign-up?email=${encodeURIComponent(email)}`

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    })

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed")
      setLoading(false)
      return
    }

    // Reached here = inline confirmation (wallet or card without 3DS).
    // Redirect manually so sign-up page gets the payment_intent param.
    if (paymentIntent?.status === "succeeded") {
      track("payment_success", { email })
      window.location.href = `${returnUrl}&payment_intent=${paymentIntent.id}`
    } else {
      setError("Payment is still processing — please wait and try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Email — we collect this ourselves so we always know who paid */}
      <div className="mb-4">
        <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400 mb-1.5">
          Email address
        </label>
        <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-3 gap-2.5 focus-within:ring-2 focus-within:ring-black transition-all bg-white">
          <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 text-[13.5px] text-gray-800 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
        <p className="text-[10.5px] text-gray-400 mt-1">
          Use this email to access your library after payment.
        </p>
      </div>

      {/* Stripe payment element */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400">Payment</span>
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-300">Stripe</span>
        </div>
        <PaymentElement options={{
          layout: "accordion",
          fields: { billingDetails: { email: "never" } },
        }} />
      </div>

      {error && <p className="text-red-500 text-[12px] mb-3">{error}</p>}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-black text-white font-bold text-[14px] py-4 rounded-2xl hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      </div>
    </form>
  )
}

// ─── Demo mode form ───────────────────────────────────────────────────────────

function DemoForm() {
  const handleDemo = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = "/sign-up"
  }

  return (
    <form onSubmit={handleDemo}>
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5 text-[12px] text-amber-700 font-medium">
        Demo mode — no payment required
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white font-bold text-[14px] py-4 rounded-2xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
      >
        Get free demo access →
      </button>
    </form>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export default function CheckoutForm() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  if (DEMO_MODE) return <DemoForm />

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch("/api/stripe/create-payment-intent", { method: "POST" })
      .then(r => r.json())
      .then(data => {
        setClientSecret(data.clientSecret)
        track("checkout_start")
      })
  }, [])

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <PaymentForm clientSecret={clientSecret} />
    </Elements>
  )
}
