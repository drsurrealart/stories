import { MessageSquare } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      message: "The stories have helped my children develop strong values while having fun. It's amazing to see them excited about learning life lessons!",
      author: "Sarah M.",
      role: "Parent of two"
    },
    {
      message: "As a teacher, I've found these stories incredibly valuable for classroom discussions about ethics and character building.",
      author: "Michael R.",
      role: "Elementary Teacher"
    },
    {
      message: "The personalized stories make learning moral lessons engaging and relevant for my teenagers. They actually look forward to our discussions!",
      author: "Lisa K.",
      role: "Parent of teenagers"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-story-background via-secondary to-story-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-primary to-[#7E69AB] bg-clip-text text-transparent">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary/10"
            >
              <div className="bg-gradient-to-br from-primary to-[#7E69AB] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.message}</p>
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-primary">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};