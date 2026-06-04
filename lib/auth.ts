import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        token.hasPaid = true
        return token
      }
      if (token.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: token.email },
            select: { hasPaid: true },
          })
          token.hasPaid = user?.hasPaid ?? false
        } catch (e) {
          console.error("jwt DB error:", e)
          token.hasPaid = false
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.hasPaid = token.hasPaid as boolean
      }
      return session
    },
    async signIn({ user }) {
      if (!user.email) return false
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name, image: user.image },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        })
      } catch (e) {
        console.error("signIn DB error:", e)
      }
      return true
    },
  },
  pages: {
    signIn: "/sign-in",
  },
})
