import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getStripe, PRICE_CENTS } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: PRICE_CENTS,
    currency: "usd",
    metadata: { email: session.user.email },
    automatic_payment_methods: { enabled: true },
  })

  return Response.json({ clientSecret: paymentIntent.client_secret })
}
