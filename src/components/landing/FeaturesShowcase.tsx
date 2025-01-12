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
      description: "Deepen understanding with thoughtful discussion prompts",
      color: "bg-gradient-to-br from-[#FFE8D9] to-[#FFB088]",
      iconColor: "text-[#FF7F50]"
    },
    {
      icon: Quote,
      title: "Related Quotes",
      description: "Reinforce moral lessons with inspiring quotes",
      color: "bg-gradient-to-br from-[#E0F4FF] to-[#87CEEB]",
      iconColor: "text-[#4682B4]"
    },
    {
      icon: Footprints,
      title: "Action Steps",
      description: "Turn lessons into real-world actions",
      color: "bg-gradient-to-br from-[#E8FFE0] to-[#98FB98]",
      iconColor: "text-[#3CB371]"
    },
    {
      icon: Sparkles,
      title: "Multiple Languages",
      description: "Create stories in 11 different languages",
      color: "bg-gradient-to-br from-[#FFE1F9] to-[#FF69B4]",
      iconColor: "text-[#FF1493]"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white via-[#F1F0FB] to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#9b87f5] to-[#E5DEFF] bg-clip-text text-transparent">
            Everything You Need to Create Amazing Stories
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Powerful tools and features to bring your stories to life
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`group flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-500 
                ${feature.color} ${feature.hoverColor} hover:-translate-y-2 shadow-lg hover:shadow-xl
                animate-fade-in opacity-0`}
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 
                bg-white/80 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-700 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Enrichment Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {enrichmentFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`group p-6 rounded-xl ${feature.color} shadow-sm hover:shadow-md 
                transition-all duration-300 hover:-translate-y-1 animate-fade-in opacity-0`}
              style={{ animationDelay: `${(index + 4) * 150}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 
                  bg-white/80 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};