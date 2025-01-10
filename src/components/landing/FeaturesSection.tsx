import { ThumbsUp, Heart, BookOpen, Award, MessageSquare, Footprints, Quote } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "AI-Powered Stories",
      description: "Personalized stories tailored to specific age groups, interests, and learning objectives"
    },
    {
      icon: Heart,
      title: "Value-Based Learning",
      description: "Each story carefully crafted to teach important life lessons and moral values"
    },
    {
      icon: MessageSquare,
      title: "Reflection Questions",
      description: "Thought-provoking questions to deepen understanding and encourage critical thinking"
    },
    {
      icon: Footprints,
      title: "Action Steps",
      description: "Practical steps to apply moral lessons in real-life situations"
    },
    {
      icon: Quote,
      title: "Related Quotes",
      description: "Inspiring quotes that reinforce the story's moral message"
    },
    {
      icon: Award,
      title: "Discussion Prompts",
      description: "Engaging prompts to facilitate meaningful conversations about the story"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-secondary/50 to-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
          Enriched Learning Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <feature.icon className="w-8 h-8 text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};