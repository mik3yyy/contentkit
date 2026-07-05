import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import SubscribeButton from "./SubscribeButton"

export default async function UpgradePage() {
  const session = await auth()
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  if (!isDemo && session?.user?.subscriptionStatus === "active") redirect("/generate")

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-[0.14em] mb-3">ContentKit AI</p>
      <h1 className="text-[32px] font-bold tracking-tight mb-3 text-balance">
        Generate videos from your own library
      </h1>
      <p className="text-white/60 text-[15px] leading-relaxed mb-10">
        Pick a niche and get a ready-to-post short instantly, or bring your own
        footage and let AI cut it together with clips from your ContentKit library.
      </p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
        <p className="text-[13px] text-white/50 mb-1">Monthly</p>
        <p className="text-[40px] font-bold tracking-tight mb-1">$19<span className="text-[16px] font-medium text-white/50">/mo</span></p>
        <p className="text-[13px] text-white/50 mb-6">2,000 credits every month</p>
        <SubscribeButton />
      </div>

      <p className="text-[12px] text-white/40">Cancel anytime. Credits reset each billing cycle.</p>
    </div>
  )
}
