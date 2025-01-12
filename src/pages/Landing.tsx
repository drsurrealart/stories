import { HeroSection } from "@/components/landing/HeroSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FeaturesShowcase } from "@/components/landing/FeaturesShowcase";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { AgeGroupsSection } from "@/components/landing/AgeGroupsSection";
import { CTASection } from "@/components/landing/CTASection";
import { NavigationBar } from "@/components/NavigationBar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main>
        <HeroSection />
        <FeaturesShowcase />
        <BenefitsSection />
        <AgeGroupsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Landing;