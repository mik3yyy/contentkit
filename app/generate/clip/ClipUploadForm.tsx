"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { startClippingJob } from "../actions"

type NicheCount = { niche: string; count: number }

export default function ClipUploadForm({ credits, niches }: { credits: number; niches: NicheCount[] }) {
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [niche, setNiche] = useState<string | null>(null)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!file || !niche) return
    setError(null)

    try {
      setProgress("Requesting upload slot…")
      const urlRes = await fetch("/api/generate/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, fileSizeBytes: file.size }),
      })
      const urlData = await urlRes.json()
      if (!urlRes.ok) {
        setError(urlData.error ?? "Could not start the upload")
        setProgress(null)
        return
      }

      setProgress("Uploading your video…")
      const putRes = await fetch(urlData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      })
      if (!putRes.ok) {
        setError("Upload failed — please try again")
        setProgress(null)
        return
      }

      setProgress("Starting the clip job…")
      const jobRes = await startClippingJob(urlData.r2Key, niche)
      if ("error" in jobRes && jobRes.error) {
        setError(jobRes.error)
        setProgress(null)
        return
      }

      router.push(`/generate/clip/${(jobRes as { jobId: string }).jobId}`)
    } catch {
      setError("Something went wrong — please try again")
      setProgress(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-[0.14em] mb-2">Clip your own footage</p>
          <h1 className="text-[26px] font-bold tracking-tight">Upload a video</h1>
        </div>
        <span className="text-[13px] text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          {credits.toLocaleString()} credits
        </span>
      </div>

      <p className="text-white/50 text-[14px] leading-relaxed mb-8">
        We'll cut in clips from your library around the natural pauses in your video —
        no manual editing needed. Costs 300 credits. Upload an .mp4 or .mov you have the rights to use.
      </p>

      <div
        onClick={() => fileInput.current?.click()}
        className="border border-dashed border-white/20 hover:border-indigo-400/60 rounded-2xl p-10 text-center cursor-pointer transition-colors mb-6"
      >
        <input
          ref={fileInput}
          type="file"
          accept="video/mp4,video/quicktime"
          className="hidden"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <p className="text-[14px]">{file.name} <span className="text-white/40">({(file.size / 1024 / 1024).toFixed(1)} MB)</span></p>
        ) : (
          <p className="text-white/50 text-[14px]">Click to choose a video file</p>
        )}
      </div>

      <h2 className="text-[14px] font-semibold mb-3">Which niche should the cutaway clips come from?</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {niches.length === 0 && <p className="text-white/40 text-[13px]">No cutaway clips ready yet — check back soon.</p>}
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

      <button
        onClick={handleSubmit}
        disabled={!file || !niche || !!progress}
        className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-semibold text-[14px] rounded-xl px-5 py-2.5 transition-colors"
      >
        {progress ?? "Start clipping"}
      </button>

      {error && <p className="text-red-400 text-[13px] mt-4">{error}</p>}
    </div>
  )
}
