import Link from "next/link"

export const metadata = { title: "Terms & Conditions – ContentKit" }

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#eeecea]">
      <div className="max-w-[760px] mx-auto px-6 py-20">
        <Link href="/" className="text-[13px] text-gray-500 hover:text-black transition-colors mb-10 inline-block">← Back to ContentKit</Link>

        <h1 className="text-[42px] font-black tracking-tight text-black mb-2">Terms &amp; Conditions</h1>
        <p className="text-[13px] text-gray-400 mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-[15px] text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or purchasing ContentKit, you agree to be bound by these Terms & Conditions, our <Link href="/privacy" className="underline text-black">Privacy Policy</Link>, and our <Link href="/refund" className="underline text-black">Refund Policy</Link>. If you do not agree, do not use this service.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">2. The Product</h2>
            <p>ContentKit provides a one-time-payment digital library containing video clips, ebooks, templates, presets, and related digital assets (&quot;Content&quot;). Access is granted immediately upon successful payment and remains valid for the lifetime of the product.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">3. License</h2>
            <p>Upon purchase you receive a <strong>non-exclusive, worldwide, perpetual license</strong> to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Download, edit, and use the Content for personal and commercial projects.</li>
              <li>Post Content on social media platforms (TikTok, Instagram, YouTube, etc.).</li>
              <li>Resell the Content as standalone digital products or as part of bundles.</li>
              <li>Deliver Content to clients as part of a paid service.</li>
            </ul>
            <p className="mt-4">You may <strong>not</strong>:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Redistribute the ContentKit library in its entirety as a competing product.</li>
              <li>Share login credentials with others.</li>
              <li>Claim original authorship of unmodified Content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">4. Payments & Pricing</h2>
            <p>All prices are in US dollars. Payment is processed securely through Stripe. By completing payment you authorise the charge to your payment method. Discounted purchases are subject to the terms outlined in our <Link href="/refund" className="underline text-black">Refund Policy</Link> and are <strong>non-refundable</strong>.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">5. Account Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your login credentials. You agree not to share your account with any third party. Accounts found to be shared may be terminated without refund.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">6. Content Updates</h2>
            <p>We aim to add new content regularly. We do not guarantee a specific cadence or volume of updates. No refund will be issued for dissatisfaction with the update schedule.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">7. Limitation of Liability</h2>
            <p>ContentKit is provided &quot;as is.&quot; To the fullest extent permitted by law, House of Michaels shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or its content.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">8. Governing Law</h2>
            <p>These terms are governed by the laws of the jurisdiction in which House of Michaels operates. Any disputes shall be resolved through binding arbitration.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">9. Contact</h2>
            <p>Questions? Email <a href="mailto:support@contentkit.com" className="underline text-black font-medium">support@contentkit.com</a>.</p>
          </section>

          <div className="border-t border-gray-200 pt-6 text-[12px] text-gray-400 flex gap-6">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/refund" className="hover:text-black transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
