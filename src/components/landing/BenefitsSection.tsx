import { Heart, Brain, Target, Star } from "lucide-react";

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
    },
    {
      icon: Star,
      title: "Lifelong Learning",
      description: "Foster a love for reading and continuous personal growth through storytelling",
      color: "bg-gradient-to-br from-[#D3E4FD] to-[#6B7FD7]",
      iconColor: "text-[#6B7FD7]",
      hoverColor: "hover:from-[#6B7FD7] hover:to-[#D3E4FD]"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#F1F0FB] via-white to-[#F1F0FB]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 bg-gradient-to-r from-[#9b87f5] to-[#E5DEFF] bg-clip-text text-transparent">
          Transform Learning Through Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center p-8 rounded-xl transition-all duration-500 ${benefit.color} ${benefit.hoverColor} hover:-translate-y-2 shadow-lg hover:shadow-xl`}
            >
              <benefit.icon className={`w-12 h-12 ${benefit.iconColor} mb-6`} />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{benefit.title}</h3>
              <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};