import { prisma } from "@/lib/db"
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

export const revalidate = 3600

async function fetchNicheThumbnails(niches: string[], perNiche: number): Promise<Record<string, VideoItem[]>> {
  try {
    const rows = await prisma.content.findMany({
      where: { type: "video", niche: { in: niches }, thumbnailUrl: { not: null } },
      select: { id: true, thumbnailUrl: true, niche: true },
      orderBy: { createdAt: "desc" },
      take: niches.length * perNiche,
    })
    const map: Record<string, VideoItem[]> = {}
    for (const row of rows) {
      if (!map[row.niche]) map[row.niche] = []
      if (map[row.niche].length < perNiche) {
        map[row.niche].push({ id: row.id, thumbnailUrl: row.thumbnailUrl, niche: row.niche })
      }
    }
    return map
  } catch {
    return {}
  }
}

export default async function LandingPage() {
  const HERO_NICHES = ["luxury", "fitness", "money-finance", "motivation", "food", "travel", "cars", "nature"]
  const NICHE_ROWS  = ["luxury", "fitness", "money-finance", "motivation"]

  const [heroRows, nicheRows] = await Promise.all([
    fetchNicheThumbnails(HERO_NICHES, 3),
    fetchNicheThumbnails(NICHE_ROWS, 10),
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
