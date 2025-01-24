import { HeroSection } from "@/components/landing/HeroSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FeaturesShowcase } from "@/components/landing/FeaturesShowcase";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { AgeGroupsSection } from "@/components/landing/AgeGroupsSection";
import { CTASection } from "@/components/landing/CTASection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <FeaturesShowcase />
        <AgeGroupsSection />
        <FeaturesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Landing;