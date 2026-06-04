import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import AsSeenOn from "@/components/landing/AsSeenOn"
import ForCreatorsResellers from "@/components/landing/ForCreatorsResellers"
import TheProblem from "@/components/landing/TheProblem"
import TheSolution from "@/components/landing/TheSolution"
import WhatsInside from "@/components/landing/WhatsInside"
import NichesSection from "@/components/landing/NichesSection"
import Pricing from "@/components/landing/Pricing"
import FAQ from "@/components/landing/FAQ"
import DarkCTA from "@/components/landing/DarkCTA"
import Footer from "@/components/landing/Footer"
import StickyBar from "@/components/landing/StickyBar"

export default function LandingPage() {
  return (
    <div className="bg-[#eeecea]">
      <Navbar />
      <Hero />
      <AsSeenOn />
      <ForCreatorsResellers />
      <TheProblem />
      <TheSolution />
      <WhatsInside />
      <NichesSection />
      <Pricing />
      <FAQ />
      <DarkCTA />
      <Footer />
      <StickyBar />
    </div>
  )
}
