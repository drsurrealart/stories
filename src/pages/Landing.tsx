import { HeroSection } from "@/components/landing/HeroSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FeaturesShowcase } from "@/components/landing/FeaturesShowcase";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { AgeGroupsSection } from "@/components/landing/AgeGroupsSection";
import { CTASection } from "@/components/landing/CTASection";
import { NavigationBar } from "@/components/NavigationBar";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onLogout={handleLogout} />
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