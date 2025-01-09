import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20 text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-primary">
        Begin Your Story Journey Today
      </h2>
      <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
        Join thousands of families and educators in creating meaningful stories that inspire and educate
      </p>
      <Link to="/auth">
        <Button size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
          Start Creating Stories
          <BookOpen className="ml-2 w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </Link>
    </section>
  );
};