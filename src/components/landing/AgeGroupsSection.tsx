import { User, BookOpen, Heart } from "lucide-react";
import { genresByAge, moralsByAge } from "@/data/storyOptions";

export const AgeGroupsSection = () => {
  const ageGroups = [
    {
      title: "Preschool (3-5)",
      description: "Simple, engaging tales that teach basic values",
      key: "preschool",
      displayGenres: 4,
      displayMorals: 4,
      gradient: "from-[#FFB088] to-[#FDE1D3]"
    },
    {
      title: "Elementary (6-8)",
      description: "Adventure-filled stories with clear moral lessons",
      key: "elementary",
      displayGenres: 4,
      displayMorals: 4,
      gradient: "from-[#9b87f5] to-[#E5DEFF]"
    },
    {
      title: "Tween (9-12)",
      description: "Complex narratives that build character",
      key: "tween",
      displayGenres: 4,
      displayMorals: 4,
      gradient: "from-[#86D549] to-[#F2FCE2]"
    },
    {
      title: "Teen (13-17)",
      description: "Thought-provoking stories with deep insights",
      key: "teen",
      displayGenres: 4,
      displayMorals: 4,
      gradient: "from-[#FF719A] to-[#FFE29F]"
    },
    {
      title: "Adult (18+)",
      description: "Sophisticated narratives exploring complex themes",
      key: "adult",
      displayGenres: 4,
      displayMorals: 4,
      gradient: "from-[#7E69AB] to-[#9b87f5]"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-white via-secondary/30 to-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-primary to-[#7E69AB] bg-clip-text text-transparent">
          Stories for Every Age
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {ageGroups.map((group) => (
            <div 
              key={group.key} 
              className={`p-6 bg-gradient-to-br ${group.gradient} rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="text-center mb-6">
                <div className="bg-white/90 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{group.title}</h3>
                <p className="text-gray-700 mb-4">{group.description}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-sm text-gray-800">Popular Genres</h4>
                  </div>
                  <ul className="text-sm text-gray-700 list-disc list-inside">
                    {genresByAge[group.key as keyof typeof genresByAge]
                      .slice(0, group.displayGenres)
                      .map((genre) => (
                        <li key={genre.value} className="ml-2">
                          {genre.label}
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-sm text-gray-800">Moral Lessons</h4>
                  </div>
                  <ul className="text-sm text-gray-700 list-disc list-inside">
                    {moralsByAge[group.key as keyof typeof moralsByAge]
                      .slice(0, group.displayMorals)
                      .map((moral) => (
                        <li key={moral.value} className="ml-2">
                          {moral.label}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};