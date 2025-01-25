import { NavigationBar } from "@/components/NavigationBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { FeaturesShowcase } from "@/components/landing/FeaturesShowcase";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { AgeGroupsSection } from "@/components/landing/AgeGroupsSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <NavigationBar onLogout={() => {}} />
      <HeroSection />
      <AudienceSection />
      <FeaturesShowcase />
      <FeaturesSection />
      <AgeGroupsSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Landing;