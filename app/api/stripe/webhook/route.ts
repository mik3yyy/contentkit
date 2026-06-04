import { NextRequest } from "next/server"
import { headers } from "next/headers"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get("stripe-signature")!

  let event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object
    const email = pi.metadata?.email
    if (email) {
      await prisma.user.upsert({
        where: { email },
        update: {
          hasPaid: true,
          paidAt: new Date(),
          stripePaymentId: pi.id,
        },
        create: {
          email,
          hasPaid: true,
          paidAt: new Date(),
          stripePaymentId: pi.id,
        },
      })
    }
  }

  return Response.json({ received: true })
}
