import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { AgeGroupsSection } from "@/components/landing/AgeGroupsSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FeaturesShowcase } from "@/components/landing/FeaturesShowcase";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";

const Landing = () => {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <AgeGroupsSection />
      <BenefitsSection />
      <FeaturesShowcase />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
};

export default Landing;