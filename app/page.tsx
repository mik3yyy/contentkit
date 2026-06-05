import { prisma } from "@/lib/db"
import { getDownloadUrl } from "@/lib/r2"
import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import AsSeenOn from "@/components/landing/AsSeenOn"
import ForCreatorsResellers from "@/components/landing/ForCreatorsResellers"
import TheProblem from "@/components/landing/TheProblem"
import TheSolution from "@/components/landing/TheSolution"
import WhatsInside from "@/components/landing/WhatsInside"
import NichesSection from "@/components/landing/NichesSection"
import Testimonials from "@/components/landing/Testimonials"
import Pricing from "@/components/landing/Pricing"
import FAQ from "@/components/landing/FAQ"
import DarkCTA from "@/components/landing/DarkCTA"
import Footer from "@/components/landing/Footer"
import StickyBar from "@/components/landing/StickyBar"
import FadeIn from "@/components/ui/FadeIn"
import type { VideoItem } from "@/components/ui/VideoMarqueeStrip"

// Revalidate every 50 min — keeps signed URLs (1 h TTL) from expiring between renders
export const revalidate = 3000

async function fetchNicheVideos(niches: string[], perNiche: number): Promise<Record<string, VideoItem[]>> {
  try {
    const rows = await prisma.content.findMany({
      where: { type: "video", niche: { in: niches } },
      select: { id: true, r2Key: true, thumbnailUrl: true, niche: true },
      orderBy: { createdAt: "desc" },
      take: niches.length * perNiche,
    })

    // Collect up to perNiche per niche first, then sign URLs in parallel
    const byNiche: Record<string, typeof rows> = {}
    for (const row of rows) {
      if (!byNiche[row.niche]) byNiche[row.niche] = []
      if (byNiche[row.niche].length < perNiche) byNiche[row.niche].push(row)
    }

    const entries = await Promise.all(
      Object.entries(byNiche).map(async ([niche, items]) => {
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

export default async function LandingPage() {
  const HERO_NICHES = ["luxury", "fitness", "money-finance", "motivation", "food", "travel", "cars", "nature"]
  const NICHE_ROWS  = ["luxury", "fitness", "money-finance", "motivation"]

  const [heroRows, nicheRows] = await Promise.all([
    fetchNicheVideos(HERO_NICHES, 3),
    fetchNicheVideos(NICHE_ROWS, 10),
  ])

  const heroItems: VideoItem[] = Object.values(heroRows).flat()

  return (
    <div className="bg-[#eeecea]">
      <Navbar />
      <Hero items={heroItems} />
      <FadeIn><AsSeenOn /></FadeIn>
      <FadeIn><ForCreatorsResellers /></FadeIn>
      <FadeIn><TheProblem /></FadeIn>
      <FadeIn><TheSolution /></FadeIn>
      <FadeIn><WhatsInside /></FadeIn>
      <FadeIn><NichesSection nicheItems={nicheRows} /></FadeIn>
      <FadeIn><Testimonials /></FadeIn>
      <FadeIn><Pricing /></FadeIn>
      <FadeIn><FAQ /></FadeIn>
      <FadeIn><DarkCTA /></FadeIn>
      <FadeIn><Footer /></FadeIn>
      <StickyBar />
    </div>
  )
}
