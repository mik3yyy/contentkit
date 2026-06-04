import CheckoutForm from "./CheckoutForm"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function CheckoutPage() {
  const session = await auth()

  if (!session) {
    redirect("/sign-in?callbackUrl=/checkout")
  }

  if (session.user?.hasPaid) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#eeecea] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[1000px] grid grid-cols-2 gap-12 items-start">
        {/* Left: summary */}
        <div className="pt-4">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg width="15" height="15" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span className="font-bold text-[17px]">ContentKit</span>
          </div>

          <h1 className="text-[36px] font-black tracking-tight text-black leading-tight mb-2">
            Get lifetime access.<br />Pay once.
          </h1>
          <p className="text-[16px] text-gray-500 mb-8">Everything unlocked forever. No recurring charges.</p>

          <div className="space-y-3 mb-8">
            {[
              "100,000+ HD & 4K videos",
              "5,000+ rebrandable ebooks & guides",
              "Templates, presets & sound packs",
              "Full commercial + resell rights",
              "New content added weekly",
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-[14px] text-gray-700">
                <svg width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                {f}
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[48px] font-black text-black">$97</span>
            <span className="text-[16px] text-gray-400 line-through">$297</span>
          </div>
          <p className="text-[13px] text-gray-500">One-time payment · 30-day money-back guarantee</p>
        </div>

        {/* Right: payment form */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <CheckoutForm userEmail={session.user?.email ?? ""} />
        </div>
      </div>
    </div>
  )
}
