import { Heart, Users, Award, Brain, Sparkles, Target } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Build Character",
      description: "Develop empathy, kindness, and strong moral values through engaging narratives",
      color: "bg-[#FDE1D3]",
      iconColor: "text-[#F97316]"
    },
    {
      icon: Brain,
      title: "Critical Thinking",
      description: "Enhance analytical skills through reflection questions and thoughtful discussions",
      color: "bg-[#E5DEFF]",
      iconColor: "text-primary"
    },
    {
      icon: Target,
      title: "Practical Application",
      description: "Transform learning into action with clear, actionable steps for real-life situations",
      color: "bg-[#F2FCE2]",
      iconColor: "text-[#4CAF50]"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
          Transform Learning Through Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center p-8 rounded-lg transition-all duration-300 hover:-translate-y-1 ${benefit.color}`}
            >
              <benefit.icon className={`w-12 h-12 ${benefit.iconColor} mb-4`} />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};