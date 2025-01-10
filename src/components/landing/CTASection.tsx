import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 text-center bg-gradient-to-b from-[#F1F0FB] via-white to-[#E5DEFF]">
      <div className="max-w-3xl mx-auto">
        <div className="relative mb-8">
          <Sparkles className="w-12 h-12 text-[#9b87f5] mx-auto mb-6 animate-pulse" />
        </div>
        <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-[#9b87f5] to-[#E5DEFF] bg-clip-text text-transparent">
          Begin Your Story Journey Today
        </h2>
        <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto px-4">
          Join thousands of families and educators in creating meaningful stories that inspire, educate, and transform lives through our enhanced learning features.
        </p>
        <Link to="/auth">
          <Button 
            size="lg" 
            className="text-base md:text-lg px-8 md:px-12 py-6 md:py-8 bg-gradient-to-r from-[#9b87f5] to-[#E5DEFF] hover:from-[#E5DEFF] hover:to-[#9b87f5] transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Create Your First Story
            <BookOpen className="ml-2 w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </Link>
      </div>
    </section>
  );
};