import { NavigationBar } from "@/components/NavigationBar";
import { Card } from "@/components/ui/card";
import { ageGroups, moralsByAge } from "@/data/storyOptions";
import { BookOpen, Lightbulb, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Explore = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <NavigationBar onLogout={handleLogout} />
      <main className="container py-8 px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-[#7E69AB] bg-clip-text text-transparent">
            Explore Moral Lessons
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover age-appropriate moral lessons and values that help shape character and understanding.
          </p>
        </div>

        <div className="grid gap-8">
          {ageGroups.map((age) => (
            <section key={age.value} className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">{age.label}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moralsByAge[age.value as keyof typeof moralsByAge].map((moral, index) => (
                  <Card 
                    key={moral.value}
                    className={`p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                      index % 2 === 0 ? 'bg-secondary' : 'bg-story-background'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Lightbulb className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">
                          {moral.label}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-primary-hover">
                          <BookOpen className="w-4 h-4" />
                          <span>Create a story about this</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
};

export default Explore;