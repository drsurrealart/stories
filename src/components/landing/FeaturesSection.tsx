import { ThumbsUp, Heart, BookOpen, Award } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: ThumbsUp,
      title: "Personalized Experience",
      description: "Stories tailored to specific age groups, interests, and learning objectives"
    },
    {
      icon: Heart,
      title: "Value-Based Learning",
      description: "Each story carefully crafted to teach important life lessons and moral values"
    },
    {
      icon: BookOpen,
      title: "Diverse Content",
      description: "Wide range of genres and themes to keep readers engaged and excited"
    },
    {
      icon: Award,
      title: "Educational Impact",
      description: "Stories designed to promote critical thinking and emotional intelligence"
    }
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
          Why Choose AI Story Time?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <feature.icon className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};