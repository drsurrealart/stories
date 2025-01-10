import { Globe, User, Sliders } from "lucide-react";

export const FeaturesShowcase = () => {
  const features = [
    {
      icon: Globe,
      title: "Create Stories in 11 Languages!",
      description: "From English to Japanese, tell your stories in multiple languages",
      color: "bg-gradient-to-br from-[#D3E4FD] to-[#E5DEFF]",
      iconColor: "text-[#6B7FD7]",
      hoverColor: "hover:from-[#E5DEFF] hover:to-[#D3E4FD]"
    },
    {
      icon: User,
      title: "Personalized Character Names",
      description: "Make stories more engaging with custom character names",
      color: "bg-gradient-to-br from-[#FDE1D3] to-[#FFDEE2]",
      iconColor: "text-[#FF719A]",
      hoverColor: "hover:from-[#FFDEE2] hover:to-[#FDE1D3]"
    },
    {
      icon: Sliders,
      title: "Customizable Story Features",
      description: "Adjust age level, length, reading level, and tone to match your needs",
      color: "bg-gradient-to-br from-[#F2FCE2] to-[#FEF7CD]",
      iconColor: "text-[#97B555]",
      hoverColor: "hover:from-[#FEF7CD] hover:to-[#F2FCE2]"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#F1F0FB] to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#9b87f5] to-[#E5DEFF] bg-clip-text text-transparent">
          Powerful Story Creation Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-xl transition-all duration-500 ${feature.color} ${feature.hoverColor} hover:-translate-y-2 shadow-lg hover:shadow-xl group`}
            >
              <feature.icon className={`w-12 h-12 ${feature.iconColor} mb-6 group-hover:scale-110 transition-transform duration-300`} />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};