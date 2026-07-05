import { auth } from "@/lib/auth"
import { getStripe, GENERATE_PRICE_ID } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: "Not signed in" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  const stripe = getStripe()

  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email })
    customerId = customer.id
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } })
  }

  const origin = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: GENERATE_PRICE_ID, quantity: 1 }],
    success_url: `${origin}/generate?checkout=success`,
    cancel_url: `${origin}/generate/upgrade?checkout=cancelled`,
    metadata: { userId: user.id },
  })

  return Response.json({ url: checkoutSession.url })
}
