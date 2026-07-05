"use client"

import { useState } from "react"
import Link from "next/link"
import { generateFromNiche } from "./actions"

type NicheCount = { niche: string; count: number }

export default function ModePicker({ credits, niches }: { credits: number; niches: NicheCount[] }) {
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ downloadUrl: string; title: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!selectedNiche) return
    setLoading(true)
    setError(null)
    setResult(null)
    const res = await generateFromNiche(selectedNiche)
    setLoading(false)
    if ("error" in res && res.error) setError(res.error)
    else if ("downloadUrl" in res) setResult(res as { downloadUrl: string; title: string })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-[26px] font-bold tracking-tight">Generate</h1>
        <span className="text-[13px] text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          {credits.toLocaleString()} credits
        </span>
      </div>

      <div className="grid gap-4 mb-10">
        <ModeCard
          title="Niche pick"
          description="Get an existing, ready-to-post short from a niche you choose. No credits wasted on edits — this one's already finished."
          cost="100 credits"
          active
        />
        <ModeCard
          title="Script to video"
          description="Type what you want the video to say — we assemble matching clips, captions, and optional AI voiceover. Comes with a full editor to tweak before you download."
          cost="Coming soon"
        />
        <Link href="/generate/clip">
          <ModeCard
            title="Clip your own footage"
            description="Upload your own video and we'll interleave it with matching clips from your library, automatically. Comes with a full editor to tweak before you download."
            cost="300 credits"
            active
            clickable
          />
        </Link>
      </div>

      <div className="border border-white/10 rounded-2xl p-6">
        <h2 className="text-[15px] font-semibold mb-4">Pick a niche</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {niches.length === 0 && (
            <p className="text-white/40 text-[13px]">No niches ready yet — check back soon.</p>
          )}
          {niches.map(({ niche, count }) => (
            <button
              key={niche}
              onClick={() => { setSelectedNiche(niche); setResult(null); setError(null) }}
              className={`px-3.5 py-2 rounded-full border text-[13px] capitalize transition-colors ${
                selectedNiche === niche
                  ? "bg-indigo-500 border-indigo-500 text-white"
                  : "border-white/10 hover:border-indigo-400/60 hover:bg-white/5"
              }`}
            >
              {niche.replace("-", " ")} <span className="opacity-50">({count})</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedNiche || loading}
          className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-semibold text-[14px] rounded-xl px-5 py-2.5 transition-colors"
        >
          {loading ? "Generating…" : "Generate"}
        </button>

        {error && <p className="text-red-400 text-[13px] mt-4">{error}</p>}

        {result && (
          <div className="mt-5 p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-[14px] font-medium mb-2">{result.title}</p>
            <a
              href={result.downloadUrl}
              className="inline-block bg-white text-black text-[13px] font-semibold rounded-lg px-4 py-2"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function ModeCard({ title, description, cost, active, clickable }: { title: string; description: string; cost: string; active?: boolean; clickable?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 transition-colors ${active ? "border-indigo-400/40 bg-indigo-500/5" : "border-white/10 opacity-60"} ${clickable ? "cursor-pointer hover:border-indigo-400/70 hover:bg-indigo-500/10" : ""}`}>
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-[15px] font-semibold">{title}</h3>
        <span className="text-[11px] text-white/50">{cost}</span>
      </div>
      <p className="text-[13px] text-white/50 leading-relaxed">{description}</p>
    </div>
  )
}
