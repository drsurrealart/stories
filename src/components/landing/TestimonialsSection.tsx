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
    <section className="bg-story-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <p className="text-gray-600 mb-4">{testimonial.message}</p>
              <div className="font-semibold">{testimonial.author}</div>
              <div className="text-sm text-gray-500">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};