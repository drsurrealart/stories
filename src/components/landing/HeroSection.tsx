import { Button } from "@/components/ui/button";
import { BookOpen, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F1F0FB] to-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#9b87f5]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#E5DEFF]/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-12 md:pt-20 pb-16 md:pb-32 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-8 inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9b87f5] to-[#E5DEFF] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <img 
              src="/lovable-uploads/a9b9dcba-e93f-40b8-b434-166fe8567c97.png"
              alt="LearnMorals.com Logo" 
              className="relative w-32 h-32 animate-fade-in"
            />
            <div className="absolute top-0 right-0 w-6 h-6 bg-[#9b87f5]/20 rounded-full animate-pulse" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#9b87f5]/20 rounded-full animate-pulse delay-300" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 animate-fade-in bg-gradient-to-r from-[#9b87f5] via-[#8B77E5] to-[#7E69AB] bg-clip-text text-transparent drop-shadow-sm">
            AI Story Time
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-600 mb-8 md:mb-12 animate-fade-in max-w-2xl mx-auto px-4 leading-relaxed">
            Create personalized stories with built-in reflection questions, action steps, and discussion prompts to make learning moral values engaging and impactful.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/pricing">
              <Button 
                size="lg" 
                className="relative group text-base md:text-lg px-8 md:px-12 py-6 md:py-8 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Create a Story
                  <BookOpen className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            
            <Link to="/auth">
              <Button 
                size="lg" 
                variant="outline"
                className="text-base md:text-lg px-8 md:px-12 py-6 md:py-8 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
              >
                Members Login
                <LogIn className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
