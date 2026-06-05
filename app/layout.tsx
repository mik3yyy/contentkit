import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ContentKit – 100,000+ Videos & Ebooks. One Payment.",
  description:
    "100,000+ HD videos and ebooks across 50+ niches. Post them on TikTok, Reels, Shorts — or resell them as your own. One payment. Lifetime access.",
  metadataBase: new URL("https://contentkit.houseofmichaels.com"),
  openGraph: {
    title: "ContentKit – 100,000+ Videos & Ebooks. One Payment.",
    description:
      "100,000+ HD videos and ebooks across 50+ niches. One payment. Lifetime access.",
    url: "https://contentkit.houseofmichaels.com",
    siteName: "ContentKit",
    images: [{ url: "/og-image.png", width: 1024, height: 1024, alt: "ContentKit" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ContentKit – 100,000+ Videos & Ebooks. One Payment.",
    description: "100,000+ HD videos and ebooks across 50+ niches. One payment. Lifetime access.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
