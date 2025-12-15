import { InteractiveCursorBackground } from "@/components/landing-page/interactive-cursor-background"
import { LightBeams } from "@/components/landing-page/light-beams"
import { ParticleBackground } from "@/components/landing-page/particle-background"
import { Navbar } from "@/components/layout/navbar"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <InteractiveCursorBackground />

      <div className="absolute inset-0 h-screen overflow-hidden pointer-events-none">
        <ParticleBackground />
        <LightBeams />
      </div>

      <Navbar />
    </div>
  )
}

export default LandingPage