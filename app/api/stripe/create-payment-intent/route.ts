import { getStripe, PRICE_CENTS } from "@/lib/stripe"

export async function POST() {
  const paymentIntent = await getStripe().paymentIntents.create({
    amount: PRICE_CENTS,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  })

  return Response.json({ clientSecret: paymentIntent.client_secret })
}
