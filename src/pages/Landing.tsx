import { NavigationBar } from "@/components/NavigationBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <NavigationBar onLogout={() => {}} />
      <HeroSection />
      <AudienceSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Landing;