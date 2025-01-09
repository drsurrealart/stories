import { Heart, Users, Award } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Build Character",
      description: "Develop empathy, kindness, and strong moral values through engaging narratives"
    },
    {
      icon: Users,
      title: "Foster Connection",
      description: "Create meaningful discussions and strengthen bonds through shared storytelling"
    },
    {
      icon: Award,
      title: "Inspire Growth",
      description: "Encourage personal development and critical thinking skills"
    }
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
          Transform Lives Through Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6">
              <benefit.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};