import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, ChevronRight, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loading } from "@/components/ui/loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

export function StoryMorals() {
  const navigate = useNavigate();
  const { data: recentMorals, isLoading } = useQuery({
    queryKey: ['recent-morals'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, moral, action_steps')
        .eq('author_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <Loading size="sm" />;
  }

  if (!recentMorals || recentMorals.length === 0) {
    return null;
  }

  const getRandomColor = () => {
    const colors = [
      'bg-pink-100', 'bg-purple-100', 'bg-indigo-100', 
      'bg-blue-100', 'bg-green-100', 'bg-yellow-100'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">My Morals</h2>
        </div>
        <button 
          onClick={() => navigate('/my-morals')}
          className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid gap-4">
        {recentMorals.map((story, index) => (
          <Card 
            key={index} 
            className={`${getRandomColor()} border-none shadow-md transition-transform hover:scale-105`}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {story.title}
              </h3>
              <p className="text-gray-700 mb-3">{story.moral}</p>
              
              {Array.isArray(story.action_steps) && story.action_steps.length > 0 && (
                <Accordion type="single" collapsible className="bg-white/50 rounded-lg mb-3">
                  <AccordionItem value="action-steps" className="border-none">
                    <AccordionTrigger className="px-4 py-2 hover:no-underline">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <ChevronRight className="w-4 h-4" />
                        Action Steps
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      <ul className="space-y-2 text-sm">
                        {story.action_steps.map((step: string, stepIndex: number) => (
                          <li key={stepIndex} className="flex items-start gap-2">
                            <span className="font-medium min-w-[20px]">{stepIndex + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              
              <button
                onClick={() => navigate(`/your-stories?story=${story.id}`)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Read Story
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Card>
  );
}