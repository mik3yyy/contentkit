"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"
import { revalidatePath } from "next/cache"

const NICHE_ONLY_CREDIT_COST = 100
const CLIPPING_CREDIT_COST = 300
const SCRIPT_CREDIT_COST = 300
const SCRIPT_MAX_CHARS = 2000

// A clipping job's `selections` column stores the full ordered timeline as this shape,
// so a segment swap can re-render without redoing silence detection on the source video.
export type Segment =
  | { type: "original"; start: number; end: number }
  | { type: "broll"; contentId: string; r2Key: string; title: string }

// A script job's `selections` column stores one entry per script "beat" (roughly a sentence):
// the clip picked for it, its burned-in caption, and (if voiceover is on) the R2 key of the
// already-synthesized narration audio for that beat, so a clip swap can re-render without
// re-calling the TTS provider.
export type ScriptSegment = {
  type: "clip"
  contentId: string
  r2Key: string
  title: string
  captionText: string
  durationSeconds: number
  voiceoverR2Key?: string
}

export async function saveOnboarding(answers: { goal: string; niche: string }) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Not signed in")

  await prisma.user.update({
    where: { email: session.user.email },
    data: { generateOnboarding: answers },
  })

  revalidatePath("/generate")
}

export async function generateFromNiche(niche: string) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Not signed in")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error("Not signed in")
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  if (!isDemo && user.credits < NICHE_ONLY_CREDIT_COST) {
    return { error: `Not enough credits (need ${NICHE_ONLY_CREDIT_COST}, have ${user.credits})` }
  }

  const candidates = await prisma.content.findMany({
    where: { type: "video", niche, role: "standalone" },
    select: { id: true, r2Key: true, title: true },
  })
  if (candidates.length === 0) {
    return { error: `No standalone videos available yet for "${niche}"` }
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)]

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: isDemo ? {} : { credits: { decrement: NICHE_ONLY_CREDIT_COST } },
    }),
    prisma.generationJob.create({
      data: {
        userId: user.id,
        mode: "niche-only",
        status: "completed",
        niche,
        contentId: picked.id,
        creditsCost: NICHE_ONLY_CREDIT_COST,
      },
    }),
  ])

  const downloadUrl = await getDownloadUrl(picked.r2Key)
  revalidatePath("/generate")
  return { downloadUrl, title: picked.title }
}

export async function startClippingJob(sourceR2Key: string, niche: string) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Not signed in")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error("Not signed in")
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  if (!isDemo && user.credits < CLIPPING_CREDIT_COST) {
    return { error: `Not enough credits (need ${CLIPPING_CREDIT_COST}, have ${user.credits})` }
  }

  const brollCount = await prisma.content.count({ where: { type: "video", niche, role: "broll" } })
  if (brollCount === 0) {
    return { error: `No cutaway clips available yet for "${niche}"` }
  }

  const job = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: isDemo ? {} : { credits: { decrement: CLIPPING_CREDIT_COST } },
    })
    return tx.generationJob.create({
      data: {
        userId: user.id,
        mode: "clipping",
        status: "pending",
        niche,
        sourceR2Key,
        creditsCost: CLIPPING_CREDIT_COST,
      },
    })
  })

  revalidatePath("/generate")
  return { jobId: job.id }
}

export async function getJobStatus(jobId: string) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Not signed in")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error("Not signed in")

  const job = await prisma.generationJob.findFirst({ where: { id: jobId, userId: user.id } })
  if (!job) throw new Error("Job not found")

  let downloadUrl: string | null = null
  if (job.status === "completed" && job.outputR2Key) {
    downloadUrl = await getDownloadUrl(job.outputR2Key)
  }

  return {
    status: job.status,
    errorMessage: job.errorMessage,
    selections: (job.selections as (Segment | ScriptSegment)[] | null) ?? null,
    downloadUrl,
  }
}

export async function regenerateSegment(jobId: string, segmentIndex: number) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Not signed in")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error("Not signed in")

  const job = await prisma.generationJob.findFirst({ where: { id: jobId, userId: user.id } })
  if (!job || job.status !== "completed") throw new Error("Job isn't ready for editing yet")

  const selections = (job.selections as Segment[] | null) ?? []
  const target = selections[segmentIndex]
  if (!target || target.type !== "broll") throw new Error("Invalid segment")

  const usedContentIds = selections.filter((s): s is Extract<Segment, { type: "broll" }> => s.type === "broll").map(s => s.contentId)

  const alternatives = await prisma.content.findMany({
    where: {
      type: "video",
      niche: job.niche ?? undefined,
      role: "broll",
      id: { notIn: usedContentIds },
    },
    select: { id: true, r2Key: true, title: true },
  })
  if (alternatives.length === 0) {
    return { error: "No alternative clips available for this niche" }
  }

  const replacement = alternatives[Math.floor(Math.random() * alternatives.length)]
  const newSelections = [...selections]
  newSelections[segmentIndex] = { type: "broll", contentId: replacement.id, r2Key: replacement.r2Key, title: replacement.title }

  // status "processing" tells the worker to re-render this job using the existing
  // selections array (just-swapped segment included) instead of re-detecting cut points.
  await prisma.generationJob.update({
    where: { id: jobId },
    data: { selections: newSelections, status: "processing", outputR2Key: null },
  })

  return { success: true }
}

export async function startScriptJob(script: string, niche: string, voiceover: boolean) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Not signed in")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error("Not signed in")
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  if (!isDemo && user.credits < SCRIPT_CREDIT_COST) {
    return { error: `Not enough credits (need ${SCRIPT_CREDIT_COST}, have ${user.credits})` }
  }

  const trimmed = script.trim()
  if (!trimmed) return { error: "Script can't be empty" }
  if (trimmed.length > SCRIPT_MAX_CHARS) {
    return { error: `Script is too long (max ${SCRIPT_MAX_CHARS} characters)` }
  }

  const clipCount = await prisma.content.count({ where: { type: "video", niche, description: { not: null } } })
  if (clipCount === 0) {
    return { error: `No matchable clips available yet for "${niche}"` }
  }

  const job = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: isDemo ? {} : { credits: { decrement: SCRIPT_CREDIT_COST } },
    })
    return tx.generationJob.create({
      data: {
        userId: user.id,
        mode: "script",
        status: "pending",
        niche,
        script: trimmed,
        voiceover,
        creditsCost: SCRIPT_CREDIT_COST,
      },
    })
  })

  revalidatePath("/generate")
  return { jobId: job.id }
}

export async function regenerateScriptSegment(jobId: string, segmentIndex: number) {
  const session = await auth()
  if (!session?.user?.email) throw new Error("Not signed in")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error("Not signed in")

  const job = await prisma.generationJob.findFirst({ where: { id: jobId, userId: user.id } })
  if (!job || job.status !== "completed") throw new Error("Job isn't ready for editing yet")

  const selections = (job.selections as ScriptSegment[] | null) ?? []
  const target = selections[segmentIndex]
  if (!target) throw new Error("Invalid segment")

  const usedContentIds = selections.map(s => s.contentId)

  const alternatives = await prisma.content.findMany({
    where: {
      type: "video",
      niche: job.niche ?? undefined,
      description: { not: null },
      id: { notIn: usedContentIds },
      OR: [{ durationSeconds: null }, { durationSeconds: { gte: Math.ceil(target.durationSeconds) } }],
    },
    select: { id: true, r2Key: true, title: true },
  })
  if (alternatives.length === 0) {
    return { error: "No alternative clips available for this niche" }
  }

  const replacement = alternatives[Math.floor(Math.random() * alternatives.length)]
  const newSelections = [...selections]
  newSelections[segmentIndex] = { ...target, contentId: replacement.id, r2Key: replacement.r2Key, title: replacement.title }

  // status "processing" tells the worker to re-render using the existing selections (including
  // the already-uploaded voiceover audio for this beat, if any) instead of redoing TTS/matching.
  await prisma.generationJob.update({
    where: { id: jobId },
    data: { selections: newSelections, status: "processing", outputR2Key: null },
  })

  return { success: true }
}
