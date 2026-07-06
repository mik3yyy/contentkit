"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { startScriptJob } from "../actions"

type NicheCount = { niche: string; count: number }

const MAX_CHARS = 2000

export default function ScriptForm({ credits, niches, voiceoverAvailable }: { credits: number; niches: NicheCount[]; voiceoverAvailable: boolean }) {
  const router = useRouter()
  const [script, setScript] = useState("")
  const [niche, setNiche] = useState<string | null>(null)
  const [voiceover, setVoiceover] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!script.trim() || !niche) return
    setLoading(true)
    setError(null)

    const res = await startScriptJob(script, niche, voiceover && voiceoverAvailable)
    if ("error" in res && res.error) {
      setError(res.error)
      setLoading(false)
      return
    }

    router.push(`/generate/script/${(res as { jobId: string }).jobId}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-[0.14em] mb-2">Script to video</p>
          <h1 className="text-[26px] font-bold tracking-tight">Write your script</h1>
        </div>
        <span className="text-[13px] text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          {credits.toLocaleString()} credits
        </span>
      </div>

      <p className="text-white/50 text-[14px] leading-relaxed mb-8">
        Type what you want the video to say. We&apos;ll split it into beats, match a clip from your
        library to each one, and burn in captions. Costs 300 credits.
      </p>

      <textarea
        value={script}
        onChange={e => setScript(e.target.value.slice(0, MAX_CHARS))}
        placeholder="Most people give up right before the breakthrough. The only difference between you and the person you look up to is..."
        rows={7}
        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-400/60 mb-2 resize-none"
      />
      <p className="text-white/30 text-[12px] mb-6 text-right">{script.length} / {MAX_CHARS}</p>

      <h2 className="text-[14px] font-semibold mb-3">Which niche should the clips come from?</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {niches.length === 0 && <p className="text-white/40 text-[13px]">No matchable clips ready yet — check back soon.</p>}
        {niches.map(({ niche: n, count }) => (
          <button
            key={n}
            onClick={() => setNiche(n)}
            className={`px-3.5 py-2 rounded-full border text-[13px] capitalize transition-colors ${
              niche === n ? "bg-indigo-500 border-indigo-500 text-white" : "border-white/10 hover:border-indigo-400/60 hover:bg-white/5"
            }`}
          >
            {n.replace("-", " ")} <span className="opacity-50">({count})</span>
          </button>
        ))}
      </div>

      <label className={`flex items-start gap-3 mb-8 ${voiceoverAvailable ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}>
        <input
          type="checkbox"
          checked={voiceover}
          disabled={!voiceoverAvailable}
          onChange={e => setVoiceover(e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-[13px] text-white/70">
          Add an AI voiceover narrating the script
          {!voiceoverAvailable && <span className="block text-white/40 text-[12px] mt-0.5">Not configured yet — coming soon.</span>}
        </span>
      </label>

      <button
        onClick={handleSubmit}
        disabled={!script.trim() || !niche || loading}
        className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-semibold text-[14px] rounded-xl px-5 py-2.5 transition-colors"
      >
        {loading ? "Starting…" : "Generate video"}
      </button>

      {error && <p className="text-red-400 text-[13px] mt-4">{error}</p>}
    </div>
  )
}
