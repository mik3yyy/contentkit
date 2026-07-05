import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-05-27.dahlia",
    })
  }
  return _stripe
}

export const PRICE_CENTS = 1200 // $12.00 (discounted from $80)

export const GENERATE_PRICE_ID = process.env.STRIPE_GENERATE_PRICE_ID! // AI Generator monthly subscription, $19/mo
export const GENERATE_CREDITS_PER_CYCLE = 2000
