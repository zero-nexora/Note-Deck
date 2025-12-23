import { AdvancedFeaturesSection } from "@/components/landing-page/advanced-features-section";
import { AutomationSection } from "@/components/landing-page/automation-section";
import { BlobTransition } from "@/components/landing-page/blob-transition";
import { BoardShowcase } from "@/components/landing-page/board-showcase";
import { CTASection } from "@/components/landing-page/CTA-section";
import { FAQSection } from "@/components/landing-page/FAQ-section";
import { FeaturesSection } from "@/components/landing-page/features-section";
import { Footer } from "@/components/landing-page/footer";
import { HeroSection } from "@/components/landing-page/hero-section";
import { HowItWorkSection } from "@/components/landing-page/how-it-works-section";
import { InteractiveCursorBackground } from "@/components/landing-page/interactive-cursor-background";
import { LightBeams } from "@/components/landing-page/light-beams";
import { Navbar } from "@/components/landing-page/navbar";
import { ParticleBackground } from "@/components/landing-page/particle-background";
import { PricingPreviewSection } from "@/components/landing-page/pricing-preview-section";
import { PricingSection } from "@/components/landing-page/pricing-section";
import { RealtimeShowcase } from "@/components/landing-page/realtime-showcase";
import { SocialProof } from "@/components/landing-page/social-proof";
import { TestimonialsGallery } from "@/components/landing-page/testimonials-gallery";
import { TestimonialsSection } from "@/components/landing-page/testimonials-section";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <InteractiveCursorBackground />

      <div className="absolute inset-0 h-screen overflow-hidden pointer-events-none">
        <ParticleBackground />
        <LightBeams />
      </div>

      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <SocialProof />

        <BlobTransition />

        <FeaturesSection />

        <BlobTransition />

        <AdvancedFeaturesSection />

        <BlobTransition />

        <HowItWorkSection />

        <RealtimeShowcase />
        <BoardShowcase />

        <BlobTransition />

        <AutomationSection />

        <BlobTransition />

        <PricingPreviewSection />

        <BlobTransition />

        <TestimonialsGallery />

        <BlobTransition />

        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
