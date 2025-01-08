import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, BookOpen, Heart, Rocket } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 md:pt-20 pb-16 md:pb-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 md:mb-6 animate-fade-in">
          AI Story Time
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto animate-fade-in px-4">
          Create personalized stories with meaningful moral lessons for children of all ages
        </p>
        <Link to="/auth">
          <Button size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
            Sign Up Free
            <Rocket className="ml-2 w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
            Why Choose AI Story Time?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-story-background p-6 rounded-lg text-center">
              <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-3">Personalized Stories</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Create unique stories tailored to your child's age, interests, and learning goals
              </p>
            </div>
            <div className="bg-story-background p-6 rounded-lg text-center">
              <Heart className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-3">Moral Values</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Each story comes with meaningful lessons that help shape character and values
              </p>
            </div>
            <div className="bg-story-background p-6 rounded-lg text-center">
              <Award className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-3">Educational Impact</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Engage children in learning through interactive storytelling and reflection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-primary">
          Start Your Story Journey Today
        </h2>
        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          Join thousands of parents and educators in creating meaningful stories that inspire and educate
        </p>
        <Link to="/auth">
          <Button size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
            Get Started Now
            <Rocket className="ml-2 w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Landing;