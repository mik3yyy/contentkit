"use client"

import { useState } from "react"

const FAQS = [
  {
    q: "What exactly is ContentKit?",
    a: "ContentKit is a one-time purchase that gives you lifetime access to 100,000+ HD & 4K faceless videos, 5,000+ rebrandable ebooks, templates, sound packs, and more — all hosted on our platform so you can search, preview, and download instantly.",
  },
  {
    q: "Is it really a one-time payment?",
    a: "Yes — you pay once and get lifetime access. No subscriptions, no renewals, no hidden fees. We add new content weekly at no extra charge.",
  },
  {
    q: "Can I resell the content?",
    a: "Absolutely. You have full commercial and resell rights. Package the videos into niche bundles, rebrand the ebooks under your name, run them as paid ads — and keep 100% of what you earn.",
  },
  {
    q: "What format are the files?",
    a: "Videos are MP4 (HD & 4K, 9:16 vertical). Ebooks are PDF. Templates are Canva/Google Docs compatible. Everything is ready to use immediately after download.",
  },
  {
    q: "How do I access everything after purchase?",
    a: "You'll get instant access to your ContentKit dashboard where you can search, filter by niche, preview clips, and download anything in seconds. No waiting, no approval required.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes. We offer a 30-day money-back guarantee. If you're not satisfied for any reason, email us and we'll refund you in full — no questions asked.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-[#eeecea] py-24">
      <div className="max-w-[740px] mx-auto px-6">
        <h2 className="text-[42px] font-black tracking-tight text-black mb-14 text-center">Frequently asked questions.</h2>
        <div className="divide-y divide-gray-200">
          {FAQS.map((item, i) => (
            <div key={i} className="py-5">
              <button
                className="w-full flex items-center justify-between text-left select-none"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-[16px] font-semibold text-black pr-4">{item.q}</span>
                <span className={`shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </span>
              </button>
              {open === i && (
                <p className="text-[14px] text-gray-500 leading-relaxed mt-3 pr-8">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
