import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        if (!email || !password) return null

        if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
          return { id: "demo", email, name: email.split("@")[0] }
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.password) return null
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.name ?? undefined }
      },
    }),
  ],
  session: { strategy: "jwt" },
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
        } catch {
          token.hasPaid = false
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.hasPaid = token.hasPaid as boolean
      return session
    },
  },
  pages: { signIn: "/sign-in" },
})
