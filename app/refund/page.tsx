import Link from "next/link"

export const metadata = { title: "Refund Policy – ContentKit" }

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#eeecea]">
      <div className="max-w-[760px] mx-auto px-6 py-20">
        <Link href="/" className="text-[13px] text-gray-500 hover:text-black transition-colors mb-10 inline-block">← Back to ContentKit</Link>

        <h1 className="text-[42px] font-black tracking-tight text-black mb-2">Refund Policy</h1>
        <p className="text-[13px] text-gray-400 mb-10">Last updated: June 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-[15px] text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">Overview</h2>
            <p>ContentKit is a digital product. Because you receive instant, lifetime access to over 100,000 files upon purchase, we operate a limited refund policy as described below. Please read this policy carefully before completing your purchase.</p>
          </section>

          <p className="font-bold text-black text-[16px]">Discounted purchases are non-refundable.</p>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">Full-Price Purchases</h2>
            <p>Customers who pay the full retail price of $80 may request a refund within <strong>7 days</strong> of purchase, provided:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>The request is submitted within 7 calendar days of the purchase date.</li>
              <li>You contact us at <a href="mailto:support@contentkit.com" className="underline text-black">support@contentkit.com</a> with your order details.</li>
              <li>You have not downloaded more than 10% of the library content.</li>
            </ul>
            <p className="mt-4">Approved refunds are returned to the original payment method within 5–10 business days.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">No Refunds For</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Any purchase made at a discounted or promotional price (see above).</li>
              <li>Change of mind after access has been granted.</li>
              <li>Failure to read this refund policy or the product description before purchasing.</li>
              <li>Technical issues on your own device or internet connection.</li>
              <li>Partial use of the library.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">Chargebacks</h2>
            <p>Filing a chargeback for a discounted purchase is a violation of this policy. We reserve the right to permanently revoke access to ContentKit and pursue recovery of funds in the event of a fraudulent chargeback on a non-refundable discounted purchase.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">Contact</h2>
            <p>For refund requests or questions, email us at <a href="mailto:support@contentkit.com" className="underline text-black font-medium">support@contentkit.com</a>. Include your order confirmation and the email used at purchase.</p>
          </section>

          <div className="border-t border-gray-200 pt-6 text-[12px] text-gray-400 flex gap-6">
            <Link href="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
