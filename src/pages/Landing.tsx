import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, BookOpen, Heart, MessageSquare, ThumbsUp, User, Users } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 md:pt-20 pb-16 md:pb-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 md:mb-6 animate-fade-in">
          AI Story Time
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto animate-fade-in px-4">
          Create personalized stories with meaningful moral lessons for readers of all ages
        </p>
        <Link to="/auth">
          <Button size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
            Start Your Story Journey
            <BookOpen className="ml-2 w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </Link>
      </section>

      {/* Age Groups Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
            Stories for Every Age
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-story-background rounded-lg text-center">
              <User className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Preschool (3-5)</h3>
              <p className="text-gray-600">Simple, engaging tales that teach basic values</p>
            </div>
            <div className="p-6 bg-story-background rounded-lg text-center">
              <User className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Elementary (6-8)</h3>
              <p className="text-gray-600">Adventure-filled stories with clear moral lessons</p>
            </div>
            <div className="p-6 bg-story-background rounded-lg text-center">
              <User className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tween (9-12)</h3>
              <p className="text-gray-600">Complex narratives that build character</p>
            </div>
            <div className="p-6 bg-story-background rounded-lg text-center">
              <User className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Teen & Adult (13+)</h3>
              <p className="text-gray-600">Thought-provoking stories with deep insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
            Transform Lives Through Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <Heart className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Build Character</h3>
              <p className="text-gray-600">
                Develop empathy, kindness, and strong moral values through engaging narratives
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Foster Connection</h3>
              <p className="text-gray-600">
                Create meaningful discussions and strengthen bonds through shared storytelling
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Inspire Growth</h3>
              <p className="text-gray-600">
                Encourage personal development and critical thinking skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-story-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <p className="text-gray-600 mb-4">
                "The stories have helped my children develop strong values while having fun. It's amazing to see them excited about learning life lessons!"
              </p>
              <div className="font-semibold">Sarah M.</div>
              <div className="text-sm text-gray-500">Parent of two</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <p className="text-gray-600 mb-4">
                "As a teacher, I've found these stories incredibly valuable for classroom discussions about ethics and character building."
              </p>
              <div className="font-semibold">Michael R.</div>
              <div className="text-sm text-gray-500">Elementary Teacher</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <p className="text-gray-600 mb-4">
                "The personalized stories make learning moral lessons engaging and relevant for my teenagers. They actually look forward to our discussions!"
              </p>
              <div className="font-semibold">Lisa K.</div>
              <div className="text-sm text-gray-500">Parent of teenagers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
            Why Choose AI Story Time?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <ThumbsUp className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
                <p className="text-gray-600">
                  Stories tailored to specific age groups, interests, and learning objectives
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Heart className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Value-Based Learning</h3>
                <p className="text-gray-600">
                  Each story carefully crafted to teach important life lessons and moral values
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Diverse Content</h3>
                <p className="text-gray-600">
                  Wide range of genres and themes to keep readers engaged and excited
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Award className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Educational Impact</h3>
                <p className="text-gray-600">
                  Stories designed to promote critical thinking and emotional intelligence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-primary">
          Begin Your Story Journey Today
        </h2>
        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          Join thousands of families and educators in creating meaningful stories that inspire and educate
        </p>
        <Link to="/auth">
          <Button size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
            Start Creating Stories
            <BookOpen className="ml-2 w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Landing;