"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { getJobStatus, regenerateSegment, type Segment } from "../../actions"

type JobState = {
  status: string
  errorMessage: string | null
  selections: Segment[] | null
  downloadUrl: string | null
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Analyzing your video and picking clips…",
  processing: "Rendering your video…",
  completed: "Done",
  failed: "Something went wrong",
}

export default function JobStatusClient({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobState | null>(null)
  const [swapping, setSwapping] = useState<number | null>(null)

  const poll = useCallback(async () => {
    const data = await getJobStatus(jobId)
    setJob(data)
  }, [jobId])

  useEffect(() => {
    poll()
    const interval = setInterval(poll, 3000)
    return () => clearInterval(interval)
  }, [poll])

  async function handleSwap(index: number) {
    setSwapping(index)
    await regenerateSegment(jobId, index)
    await poll()
    // Worker needs a moment to pick the job back up and re-render; keep polling.
    const watchInterval = setInterval(async () => {
      const data = await getJobStatus(jobId)
      setJob(data)
      if (data.status === "completed" || data.status === "failed") {
        clearInterval(watchInterval)
        setSwapping(null)
      }
    }, 3000)
  }

  if (!job) {
    return <div className="max-w-2xl mx-auto px-6 py-24 text-center text-white/50 text-[14px]">Loading…</div>
  }

  if (job.status === "failed") {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <h1 className="text-[22px] font-bold mb-3">Something went wrong</h1>
        <p className="text-white/50 text-[14px] mb-8">{job.errorMessage ?? "The render failed. Please try again."}</p>
        <Link href="/generate/clip" className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-[14px] rounded-xl px-5 py-2.5 transition-colors inline-block">
          Try again
        </Link>
      </div>
    )
  }

  if (job.status !== "completed") {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-indigo-400 rounded-full animate-spin mx-auto mb-6" />
        <p className="text-[15px] text-white/70">{STATUS_LABEL[job.status] ?? "Working…"}</p>
        <p className="text-white/40 text-[13px] mt-2">This usually takes a couple of minutes.</p>
      </div>
    )
  }

  const brollSegments = (job.selections ?? [])
    .map((seg, index) => ({ seg, index }))
    .filter((x): x is { seg: Extract<Segment, { type: "broll" }>; index: number } => x.seg.type === "broll")

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-[0.14em] mb-2">Edit before you download</p>
      <h1 className="text-[26px] font-bold tracking-tight mb-8">Your video is ready</h1>

      {job.downloadUrl && (
        <video src={job.downloadUrl} controls className="w-full max-w-sm rounded-2xl border border-white/10 mb-8 mx-auto block" />
      )}

      <h2 className="text-[15px] font-semibold mb-4">Inserted clips</h2>
      <div className="space-y-2 mb-8">
        {brollSegments.map(({ seg, index }) => (
          <div key={index} className="flex items-center justify-between border border-white/10 rounded-xl px-4 py-3">
            <span className="text-[13px] text-white/70">{seg.title}</span>
            <button
              onClick={() => handleSwap(index)}
              disabled={swapping !== null}
              className="text-[12px] font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition-colors"
            >
              {swapping === index ? "Swapping…" : "Swap clip"}
            </button>
          </div>
        ))}
        {brollSegments.length === 0 && <p className="text-white/40 text-[13px]">No cutaway clips were inserted.</p>}
      </div>

      {job.downloadUrl && (
        <a
          href={job.downloadUrl}
          className="bg-white text-black font-semibold text-[14px] rounded-xl px-5 py-2.5 inline-block"
        >
          Download
        </a>
      )}
    </div>
  )
}
