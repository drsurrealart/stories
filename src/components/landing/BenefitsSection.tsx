import { Heart, Brain, Target } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Build Character",
      description: "Develop empathy, kindness, and strong moral values through engaging narratives",
      color: "bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1]",
      iconColor: "text-[#FF719A]",
      hoverColor: "hover:from-[#FEC6A1] hover:to-[#FDE1D3]"
    },
    {
      icon: Brain,
      title: "Critical Thinking",
      description: "Enhance analytical skills through reflection questions and thoughtful discussions",
      color: "bg-gradient-to-br from-[#E5DEFF] to-[#9b87f5]",
      iconColor: "text-[#9b87f5]",
      hoverColor: "hover:from-[#9b87f5] hover:to-[#E5DEFF]"
    },
    {
      icon: Target,
      title: "Practical Application",
      description: "Transform learning into action with clear, actionable steps for real-life situations",
      color: "bg-gradient-to-br from-[#F2FCE2] to-[#86D549]",
      iconColor: "text-[#86D549]",
      hoverColor: "hover:from-[#86D549] hover:to-[#F2FCE2]"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white via-[#F1F0FB] to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-[#9b87f5] to-[#E5DEFF] bg-clip-text text-transparent">
          Transform Learning Through Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center p-8 rounded-lg transition-all duration-500 ${benefit.color} ${benefit.hoverColor} hover:-translate-y-2 shadow-lg hover:shadow-xl`}
            >
              <benefit.icon className={`w-12 h-12 ${benefit.iconColor} mb-4`} />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{benefit.title}</h3>
              <p className="text-gray-700">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};