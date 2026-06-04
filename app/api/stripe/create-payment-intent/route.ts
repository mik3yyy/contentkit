import { NextRequest } from "next/server"
import { getStripe, PRICE_CENTS } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 })
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: PRICE_CENTS,
    currency: "usd",
    metadata: { email },
    automatic_payment_methods: { enabled: true },
  })

  return Response.json({ clientSecret: paymentIntent.client_secret })
}
