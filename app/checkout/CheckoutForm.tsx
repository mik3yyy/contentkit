"use client"

import { useEffect, useState } from "react"
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
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400">Payment</span>
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-300">Stripe</span>
        </div>
        <PaymentElement options={{ layout: "accordion" }} />
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
        <span>·</span>
        <span>30-day refund</span>
      </div>
    </form>
  )
}

export default function CheckoutForm() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/stripe/create-payment-intent", { method: "POST" })
      .then(r => r.json())
      .then(data => setClientSecret(data.clientSecret))
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
      <PaymentForm />
    </Elements>
  )
}
