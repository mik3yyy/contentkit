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

    // 1st choice: email we saved to metadata before confirming
    // 2nd choice: receipt_email Stripe sets from PaymentElement billing details
    // 3rd choice: billing email from the charge (wallet payments — Apple Pay, Google Pay)
    let email: string | null = pi.metadata?.email ?? pi.receipt_email ?? null

    if (!email && pi.latest_charge) {
      try {
        const charge = await getStripe().charges.retrieve(pi.latest_charge as string)
        email = charge.billing_details.email ?? null
      } catch {
        // best-effort; verify-payment endpoint handles the authoritative path
      }
    }

    if (email) {
      await prisma.user.upsert({
        where: { email },
        update: { hasPaid: true, paidAt: new Date(), stripePaymentId: pi.id },
        create: { email, hasPaid: true, paidAt: new Date(), stripePaymentId: pi.id },
      })
    }
  }

  return Response.json({ received: true })
}
