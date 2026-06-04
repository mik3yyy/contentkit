import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((request) => {
  if (!request.auth) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }
  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*"],
}
