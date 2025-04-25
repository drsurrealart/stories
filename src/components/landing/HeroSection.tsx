
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 pt-12 md:pt-20 pb-16 md:pb-32 text-center bg-gradient-to-b from-[#F1F0FB] to-white">
      <div className="max-w-3xl mx-auto">
        <div className="relative mb-8">
          <img 
            src="/lovable-uploads/a9b9dcba-e93f-40b8-b434-166fe8567c97.png"
            alt="LearnMorals.com Logo" 
            className="w-32 h-32 mx-auto animate-fade-in"
          />
          <div className="absolute top-0 right-1/3 w-6 h-6 bg-[#9b87f5]/20 rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-1/3 w-6 h-6 bg-[#9b87f5]/20 rounded-full animate-pulse delay-300" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 animate-fade-in bg-gradient-to-r from-[#9b87f5] to-[#E5DEFF] bg-clip-text text-transparent">
          AI Story Time
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-600 mb-8 md:mb-12 animate-fade-in max-w-2xl mx-auto px-4 leading-relaxed">
          Create personalized stories with built-in reflection questions, action steps, and discussion prompts to make learning moral values engaging and impactful.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link to="/pricing">
            <Button 
              size="lg" 
              className="text-base md:text-lg px-8 md:px-12 py-6 md:py-8 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Create a Story
              <BookOpen className="ml-2 w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </Link>
          
          <Link to="/auth">
            <Button 
              size="lg" 
              variant="outline"
              className="text-base md:text-lg px-8 md:px-12 py-6 md:py-8 border-2 hover:bg-secondary/10 transition-all duration-300 w-full sm:w-auto"
            >
              Members Login
              <LogIn className="ml-2 w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
