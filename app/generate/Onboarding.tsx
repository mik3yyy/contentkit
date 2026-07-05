"use client"

import { useState } from "react"
import { saveOnboarding } from "./actions"

const GOALS = [
  "Post daily and grow a following",
  "Save time on editing",
  "Just trying it out",
]

const NICHES = [
  "motivation", "satisfying", "luxury", "fitness", "gaming",
  "travel", "digital-marketing", "nature", "money-trading",
  "automotive", "animals", "real-estate", "backgrounds",
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState("")
  const [niche, setNiche] = useState("")
  const [saving, setSaving] = useState(false)

  async function finish(finalNiche: string) {
    setSaving(true)
    await saveOnboarding({ goal, niche: finalNiche })
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-[0.14em] mb-3">Quick setup</p>

      {step === 0 && (
        <>
          <h1 className="text-[24px] font-bold tracking-tight mb-6 text-balance">What brings you here?</h1>
          <div className="space-y-2">
            {GOALS.map(g => (
              <button
                key={g}
                onClick={() => { setGoal(g); setStep(1) }}
                className="w-full text-left px-4 py-3 rounded-xl border border-white/10 hover:border-indigo-400/60 hover:bg-white/5 transition-colors text-[14px]"
              >
                {g}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <h1 className="text-[24px] font-bold tracking-tight mb-6 text-balance">Which niche interests you most?</h1>
          <div className="flex flex-wrap gap-2">
            {NICHES.map(n => (
              <button
                key={n}
                disabled={saving}
                onClick={() => { setNiche(n); finish(n) }}
                className="px-3.5 py-2 rounded-full border border-white/10 hover:border-indigo-400/60 hover:bg-white/5 transition-colors text-[13px] capitalize disabled:opacity-50"
              >
                {n.replace("-", " ")}
              </button>
            ))}
          </div>
          {saving && <p className="text-white/40 text-[13px] mt-4">Setting things up…</p>}
        </>
      )}
    </div>
  )
}
