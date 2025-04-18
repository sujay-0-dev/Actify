import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import HowItWorks from "@/components/how-it-works"
import CallToAction from "@/components/call-to-action"
import StatsSection from "@/components/stats-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <StatsSection />
      <CallToAction />
    </>
  )
}
