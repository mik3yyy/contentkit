import { NextRequest } from "next/server"
import { headers } from "next/headers"
import { getStripe, GENERATE_CREDITS_PER_CYCLE } from "@/lib/stripe"
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

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object
    if (checkoutSession.mode === "subscription" && checkoutSession.metadata?.userId) {
      const subscriptionId = checkoutSession.subscription as string
      const subscription = await getStripe().subscriptions.retrieve(subscriptionId)
      await prisma.user.update({
        where: { id: checkoutSession.metadata.userId },
        data: {
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
          credits: GENERATE_CREDITS_PER_CYCLE,
        },
      })
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object
    const user = await prisma.user.findFirst({ where: { subscriptionId: subscription.id } })
    if (user) {
      const newPeriodEnd = new Date(subscription.items.data[0].current_period_end * 1000)
      const isNewCycle = !user.currentPeriodEnd || newPeriodEnd.getTime() > user.currentPeriodEnd.getTime()
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: subscription.status,
          currentPeriodEnd: newPeriodEnd,
          ...(isNewCycle && subscription.status === "active" ? { credits: GENERATE_CREDITS_PER_CYCLE } : {}),
        },
      })
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object
    const user = await prisma.user.findFirst({ where: { subscriptionId: subscription.id } })
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: "canceled" },
      })
    }
  }

  return Response.json({ received: true })
}
