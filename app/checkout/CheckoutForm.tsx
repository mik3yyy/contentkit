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
        return_url: `${window.location.origin}/dashboard?payment=success`,
      },
    })

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-[20px] font-bold text-black mb-6">Payment details</h2>
      <PaymentElement className="mb-6" />
      {error && <p className="text-red-500 text-[13px] mb-4">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-black text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Pay $97 — Get instant access"}
      </button>
      <p className="text-[12px] text-gray-400 text-center mt-3">Secured by Stripe · 30-day money-back guarantee</p>
    </form>
  )
}

export default function CheckoutForm({ userEmail }: { userEmail: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/stripe/create-payment-intent", { method: "POST" })
      .then(r => r.json())
      .then(data => setClientSecret(data.clientSecret))
  }, [userEmail])

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <PaymentForm />
    </Elements>
  )
}
