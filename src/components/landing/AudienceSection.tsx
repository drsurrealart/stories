import { Baby, Users, User2, GraduationCap } from "lucide-react";

export const AudienceSection = () => {
  const audiences = [
    {
      icon: Baby,
      title: "Kids",
      description: "Fun and engaging stories that teach valuable life lessons"
    },
    {
      icon: Users,
      title: "Parents",
      description: "Create meaningful moments and teach moral values through storytelling"
    },
    {
      icon: User2,
      title: "Adults",
      description: "Explore personal growth through customized moral stories"
    },
    {
      icon: GraduationCap,
      title: "Teachers",
      description: "Educational stories with lesson plans and discussion materials"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-secondary/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-primary">
          Who Is This For?
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          LearnMorals.com is designed for everyone who wants to make learning moral values engaging and impactful
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <audience.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{audience.title}</h3>
              <p className="text-gray-600 text-center">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};