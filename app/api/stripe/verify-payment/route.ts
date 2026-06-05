import { NextRequest } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

// Called from the sign-up page immediately after redirect from Stripe.
// Verifies the payment intent with Stripe directly (no webhook timing race),
// marks the user as hasPaid, and returns their email so the form can prefill.
export async function GET(req: NextRequest) {
  const piId = req.nextUrl.searchParams.get("payment_intent")
  if (!piId) return Response.json({ error: "Missing payment_intent" }, { status: 400 })

  let pi
  try {
    // Expand latest_charge so we can read billing_details.email for wallet payments
    pi = await getStripe().paymentIntents.retrieve(piId, {
      expand: ["latest_charge"],
    })
  } catch {
    return Response.json({ error: "Could not retrieve payment" }, { status: 400 })
  }

  if (pi.status !== "succeeded") {
    return Response.json({ error: "Payment not completed" }, { status: 402 })
  }

  // Resolve email: our metadata field is most reliable.
  // Fall back to receipt_email, then to wallet billing_details.email.
  let email: string | null = pi.metadata?.email ?? pi.receipt_email ?? null

  if (!email) {
    const charge = pi.latest_charge as import("stripe").Stripe.Charge | null
    email = charge?.billing_details?.email ?? null
  }

  if (!email) {
    return Response.json({ error: "No email found on payment" }, { status: 422 })
  }

  // Mark user as paid immediately — this is idempotent and safe before webhook fires
  await prisma.user.upsert({
    where: { email },
    update: { hasPaid: true, paidAt: new Date(), stripePaymentId: pi.id },
    create: { email, hasPaid: true, paidAt: new Date(), stripePaymentId: pi.id },
  })

  return Response.json({ email })
}
