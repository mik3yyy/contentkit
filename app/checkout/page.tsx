import Image from "next/image"
import CheckoutForm from "./CheckoutForm"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#eeecea] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Left: summary */}
        <div className="pt-4">
          <div className="flex items-center gap-2.5 mb-8">
            <Image src="/icon.png" alt="ContentKit" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-[17px]">ContentKit</span>
          </div>

          <h1 className="text-[28px] sm:text-[36px] font-black tracking-tight text-black leading-tight mb-2">
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
            <span className="text-[48px] font-black text-black">$12</span>
            <span className="text-[16px] text-gray-400 line-through">$80</span>
          </div>
          <p className="text-[13px] text-gray-500">One-time payment · 85% discount applied</p>
        </div>

        {/* Right: payment form */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <CheckoutForm />
        </div>
      </div>
    </div>
  )
}
