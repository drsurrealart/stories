import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 pt-12 md:pt-20 pb-16 md:pb-32 text-center">
      <img 
        src="https://media.learnmorals.com/images/logo.png" 
        alt="LearnMorals.com Logo" 
        className="w-32 h-32 mx-auto mb-6 animate-fade-in"
      />
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 md:mb-6 animate-fade-in">
        AI Story Time
      </h1>
      <p className="text-lg md:text-2xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto animate-fade-in px-4">
        "Create personalized stories in seconds that inspire, educate, and leave a lasting impact on readers of all ages."
      </p>
      <Link to="/auth">
        <Button size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
          Start Your Story Journey
          <BookOpen className="ml-2 w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </Link>
    </section>
  );
};