import { NextRequest } from "next/server"
import { getStripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const { clientSecret, email } = await req.json()
  if (!clientSecret || !email) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  // client secret format: pi_xxx_secret_xxx — extract the PI id
  const piId = clientSecret.split("_secret_")[0]
  if (!piId.startsWith("pi_")) {
    return Response.json({ error: "Invalid secret" }, { status: 400 })
  }

  await getStripe().paymentIntents.update(piId, {
    receipt_email: email,
    metadata: { email },
  })

  return Response.json({ ok: true })
}
