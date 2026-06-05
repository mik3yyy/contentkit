import Link from "next/link"

export const metadata = { title: "Privacy Policy – ContentKit" }

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#eeecea]">
      <div className="max-w-[760px] mx-auto px-6 py-20">
        <Link href="/" className="text-[13px] text-gray-500 hover:text-black transition-colors mb-10 inline-block">← Back to ContentKit</Link>

        <h1 className="text-[42px] font-black tracking-tight text-black mb-2">Privacy Policy</h1>
        <p className="text-[13px] text-gray-400 mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-[15px] text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">1. Who We Are</h2>
            <p>ContentKit is a product of House of Michaels. When this policy says &quot;we,&quot; &quot;us,&quot; or &quot;our,&quot; it refers to House of Michaels. Questions can be directed to <a href="mailto:hello@houseofmichaels.com" className="underline text-black">hello@houseofmichaels.com</a>.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">2. Information We Collect</h2>
            <p>We collect only what is necessary to operate the service:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong>Account data:</strong> name, email address, and hashed password (or Google OAuth token).</li>
              <li><strong>Payment data:</strong> processed entirely by Stripe. We never see or store your full card number.</li>
              <li><strong>Usage data:</strong> downloads and favourites you make within the library, used to personalise your experience.</li>
              <li><strong>Technical data:</strong> IP address, browser type, and device info collected automatically via server logs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To create and manage your account.</li>
              <li>To verify payment and grant access to the library.</li>
              <li>To send transactional emails (receipts, password resets).</li>
              <li>To improve the platform based on aggregate usage patterns.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p className="mt-4">We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">4. Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Stripe</strong> — payment processing. Subject to <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="underline text-black">Stripe's Privacy Policy</a>.</li>
              <li><strong>Neon (PostgreSQL)</strong> — database hosting. Your data is stored on encrypted servers.</li>
              <li><strong>Cloudflare R2</strong> — file storage for downloadable content.</li>
              <li><strong>Google OAuth</strong> — optional sign-in method. Subject to Google's Privacy Policy.</li>
              <li><strong>Resend</strong> — transactional email delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">5. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. If you request account deletion, we will remove your personal data within 30 days, except where retention is required by law or for fraud prevention.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">6. Your Rights</h2>
            <p>Depending on your jurisdiction you may have the right to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Object to or restrict processing of your data.</li>
            </ul>
            <p className="mt-4">To exercise any of these rights, email <a href="mailto:hello@houseofmichaels.com" className="underline text-black font-medium">hello@houseofmichaels.com</a>.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">7. Cookies</h2>
            <p>We use strictly necessary session cookies to keep you logged in. We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">8. Changes to This Policy</h2>
            <p>We may update this policy from time to time. Material changes will be notified via email. Continued use of ContentKit after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-black mb-3">9. Contact</h2>
            <p>Privacy questions: <a href="mailto:hello@houseofmichaels.com" className="underline text-black font-medium">hello@houseofmichaels.com</a>.</p>
          </section>

          <div className="border-t border-gray-200 pt-6 text-[12px] text-gray-400 flex gap-6">
            <Link href="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link>
            <Link href="/refund" className="hover:text-black transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
