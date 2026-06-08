import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"
import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import AsSeenOn from "@/components/landing/AsSeenOn"
import ForCreatorsResellers from "@/components/landing/ForCreatorsResellers"
import TheProblem from "@/components/landing/TheProblem"
import TheSolution from "@/components/landing/TheSolution"
import WhatsInside, { type ClipItem, type EbookItem } from "@/components/landing/WhatsInside"
import NichesSection, { type NicheRowData } from "@/components/landing/NichesSection"
import FreeSampleCTA from "@/components/landing/FreeSampleCTA"
import Pricing from "@/components/landing/Pricing"
import FAQ from "@/components/landing/FAQ"
import DarkCTA from "@/components/landing/DarkCTA"
import Footer from "@/components/landing/Footer"
import StickyBar from "@/components/landing/StickyBar"
import NewMemberToast from "@/components/landing/NewMemberToast"
import FadeIn from "@/components/ui/FadeIn"
import type { VideoItem } from "@/components/ui/VideoMarqueeStrip"

export const revalidate = 3000

function formatTitle(key: string): string {
  if (key === "money-finance") return "Money & Finance"
  return key.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

function formatCount(n: number): string {
  const thousands = Math.max(1, Math.floor(n / 1000))
  return `${(thousands * 1000).toLocaleString()}+ clips`
}

// Query each niche in parallel with its own take — prevents one niche consuming all slots
async function fetchNicheVideosIndependent(niches: string[], perNiche: number): Promise<Record<string, VideoItem[]>> {
  try {
    const rows = await Promise.all(
      niches.map(niche =>
        prisma.content.findMany({
          where: { type: "video", niche },
          select: { id: true, r2Key: true, thumbnailUrl: true, niche: true },
          orderBy: { createdAt: "desc" },
          take: perNiche,
        })
      )
    )

    const entries = await Promise.all(
      niches.map(async (niche, i) => {
        const items = rows[i]
        const signed = await Promise.all(
          items.map(async item => ({
            id:           item.id,
            videoUrl:     await getDownloadUrl(item.r2Key),
            thumbnailUrl: item.thumbnailUrl,
            niche:        item.niche,
          } satisfies VideoItem))
        )
        return [niche, signed] as const
      })
    )

    return Object.fromEntries(entries)
  } catch {
    return {}
  }
}

async function fetchClipItems(count: number): Promise<ClipItem[]> {
  try {
    // Pick one video per niche from non-gaming niches so the grid looks varied
    const niches = await prisma.content.groupBy({
      by: ["niche"],
      where: { type: "video", niche: { not: "gaming" } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: count,
    })
    const rows = await Promise.all(
      niches.map(g =>
        prisma.content.findFirst({
          where: { type: "video", niche: g.niche },
          select: { id: true, r2Key: true, thumbnailUrl: true },
          orderBy: { createdAt: "desc" },
        })
      )
    )
    const valid = rows.filter(Boolean) as NonNullable<typeof rows[number]>[]
    return await Promise.all(
      valid.map(async row => ({
        id:           row.id,
        videoUrl:     await getDownloadUrl(row.r2Key),
        thumbnailUrl: row.thumbnailUrl,
      }))
    )
  } catch {
    return []
  }
}

async function fetchEbookItems(count: number): Promise<EbookItem[]> {
  try {
    const rows = await prisma.content.findMany({
      where: { type: "ebook", thumbnailUrl: { not: null } },
      select: { id: true, thumbnailUrl: true, title: true },
      orderBy: { createdAt: "desc" },
      take: count,
    })
    return rows.map(row => ({ id: row.id, thumbnailUrl: row.thumbnailUrl, title: row.title }))
  } catch {
    return []
  }
}

export default async function LandingPage() {
  // Dynamically discover which niches have videos, ordered by clip count
  const nicheGroups = await prisma.content.groupBy({
    by: ["niche"],
    where: { type: "video" },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  }).catch(() => [])

  // Gaming goes last; everything else keeps count order
  const orderedNiches = [
    ...nicheGroups.filter(g => g.niche !== "gaming"),
    ...nicheGroups.filter(g => g.niche === "gaming"),
  ].slice(0, 5)

  const nicheKeys = orderedNiches.map(g => g.niche)

  // Hero: top 2 niches (excludes gaming) for a premium first impression
  const heroNiches = nicheGroups
    .filter(g => g.niche !== "gaming")
    .slice(0, 2)
    .map(g => g.niche)

  const [heroVideos, nicheVideos, clipItems, ebookItems] = await Promise.all([
    fetchNicheVideosIndependent(heroNiches, 10),
    fetchNicheVideosIndependent(nicheKeys, 10),
    fetchClipItems(7),
    fetchEbookItems(16),
  ])

  const heroItems: VideoItem[] = Object.values(heroVideos).flat()

  const nicheRows: NicheRowData[] = orderedNiches.map((g, i) => ({
    key:       g.niche,
    title:     formatTitle(g.niche),
    count:     formatCount(g._count.id),
    items:     nicheVideos[g.niche] ?? [],
    direction: (i % 2 === 0 ? "forward" : "reverse") as "forward" | "reverse",
  }))

  return (
    <div className="bg-[#eeecea]">
      <Navbar />
      <Hero items={heroItems} />
      <FadeIn><AsSeenOn /></FadeIn>
      <FadeIn><ForCreatorsResellers /></FadeIn>
      <FadeIn><TheProblem /></FadeIn>
      <FadeIn><TheSolution /></FadeIn>
      <FadeIn><WhatsInside clipItems={clipItems} ebookItems={ebookItems} /></FadeIn>
      <FadeIn><NichesSection rows={nicheRows} /></FadeIn>
      <FadeIn><FreeSampleCTA /></FadeIn>
      <FadeIn><Pricing /></FadeIn>
      <FadeIn><FAQ /></FadeIn>
      <FadeIn><DarkCTA /></FadeIn>
      <FadeIn><Footer /></FadeIn>
      <StickyBar />
      <NewMemberToast />
    </div>
  )
}
