import { User } from "lucide-react";

export const AgeGroupsSection = () => {
  const ageGroups = [
    {
      title: "Preschool (3-5)",
      description: "Simple, engaging tales that teach basic values"
    },
    {
      title: "Elementary (6-8)",
      description: "Adventure-filled stories with clear moral lessons"
    },
    {
      title: "Tween (9-12)",
      description: "Complex narratives that build character"
    },
    {
      title: "Teen & Adult (13+)",
      description: "Thought-provoking stories with deep insights"
    }
  ];

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
          Stories for Every Age
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ageGroups.map((group, index) => (
            <div key={index} className="p-6 bg-story-background rounded-lg text-center">
              <User className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{group.title}</h3>
              <p className="text-gray-600">{group.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};