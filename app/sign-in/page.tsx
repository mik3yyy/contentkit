import SignInButton from "@/components/ui/SignInButton"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#eeecea] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-[400px] shadow-lg border border-gray-100 text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <span className="font-bold text-[17px] tracking-tight">ContentKit</span>
        </Link>

        <h1 className="text-[24px] font-bold text-black mb-2">Welcome back</h1>
        <p className="text-[15px] text-gray-500 mb-8">Sign in to access your content library.</p>

        <SignInButton callbackUrl="/dashboard" className="w-full justify-center" />

        <p className="text-[13px] text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/checkout" className="text-black font-semibold hover:underline">Get ContentKit</Link>
        </p>
      </div>
    </div>
  )
}
