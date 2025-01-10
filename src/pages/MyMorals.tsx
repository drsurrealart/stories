import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loading } from "@/components/ui/loading";

const MyMorals = () => {
  const { data: morals, isLoading } = useQuery({
    queryKey: ['all-morals'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      
      const { data, error } = await supabase
        .from('stories')
        .select('title, moral, created_at')
        .eq('author_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <Loading />
      </div>
    );
  }

  const getRandomColor = () => {
    const colors = [
      'bg-pink-100', 'bg-purple-100', 'bg-indigo-100', 
      'bg-blue-100', 'bg-green-100', 'bg-yellow-100',
      'bg-orange-100', 'bg-red-100', 'bg-teal-100'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">My Moral Lessons</h1>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Here's a collection of all the moral lessons from your stories:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {morals?.map((story, index) => (
          <Card key={index} className={`${getRandomColor()} border-none shadow-md transition-transform hover:scale-105`}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">{story.title}</h3>
              <p className="text-gray-700">{story.moral}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyMorals;