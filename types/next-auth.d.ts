import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      hasPaid?: boolean
      subscriptionStatus?: string | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    hasPaid?: boolean
    subscriptionStatus?: string | null
  }
}
