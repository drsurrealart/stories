import { BookOpen, Headphones, Image, FileText, Sparkles, MessageSquare, Quote, Footprints } from "lucide-react";

export const FeaturesShowcase = () => {
  const mainFeatures = [
    {
      icon: BookOpen,
      title: "AI Story Creation",
      description: "Create personalized stories with moral lessons in minutes",
      color: "bg-gradient-to-br from-[#E5DEFF] to-[#9b87f5]",
      iconColor: "text-[#9b87f5]",
      hoverColor: "hover:from-[#9b87f5] hover:to-[#E5DEFF]"
    },
    {
      icon: Headphones,
      title: "Audio Stories",
      description: "Transform your stories into immersive audio experiences",
      color: "bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1]",
      iconColor: "text-[#FF719A]",
      hoverColor: "hover:from-[#FEC6A1] hover:to-[#FDE1D3]"
    },
    {
      icon: Image,
      title: "Story Illustrations",
      description: "Generate beautiful AI images to accompany your stories",
      color: "bg-gradient-to-br from-[#F2FCE2] to-[#86D549]",
      iconColor: "text-[#86D549]",
      hoverColor: "hover:from-[#86D549] hover:to-[#F2FCE2]"
    },
    {
      icon: FileText,
      title: "PDF Downloads",
      description: "Save and share your stories in beautifully formatted PDFs",
      color: "bg-gradient-to-br from-[#D3E4FD] to-[#6B7FD7]",
      iconColor: "text-[#6B7FD7]",
      hoverColor: "hover:from-[#6B7FD7] hover:to-[#D3E4FD]"
    }
  ];

  const enrichmentFeatures = [
    {
      icon: MessageSquare,
      title: "Reflection Questions",
      description: "Deepen understanding with thoughtful discussion prompts"
    },
    {
      icon: Quote,
      title: "Related Quotes",
      description: "Reinforce moral lessons with inspiring quotes"
    },
    {
      icon: Footprints,
      title: "Action Steps",
      description: "Turn lessons into real-world actions"
    },
    {
      icon: Sparkles,
      title: "Multiple Languages",
      description: "Create stories in 11 different languages"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-[#F1F0FB] to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 bg-gradient-to-r from-[#9b87f5] to-[#E5DEFF] bg-clip-text text-transparent">
          Everything You Need to Create Amazing Stories
        </h2>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center text-center p-8 rounded-xl transition-all duration-500 ${feature.color} ${feature.hoverColor} hover:-translate-y-2 shadow-lg hover:shadow-xl`}
            >
              <feature.icon className={`w-12 h-12 ${feature.iconColor} mb-4`} />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Enrichment Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {enrichmentFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <feature.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};