import { HeroSection } from "@/components/landing/HeroSection";
import { AgeGroupsSection } from "@/components/landing/AgeGroupsSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <HeroSection />
      <AgeGroupsSection />
      <BenefitsSection />
      <TestimonialsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};

export default Landing;