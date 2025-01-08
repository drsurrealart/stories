import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ageGroups, genresByAge, moralsByAge } from "@/data/storyOptions";
import { ScrollArea } from "@/components/ui/scroll-area";

type Story = {
  id: string;
  title: string;
  content: string;
  age_group: string;
  genre: string;
  moral: string;
  created_at: string;
};

export function StoryDirectory() {
  const { data: stories, isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Story[];
    },
  });

  if (isLoading) {
    return <div>Loading stories...</div>;
  }

  const getStoriesByCategory = (category: "age_group" | "genre" | "moral") => {
    const groupedStories: Record<string, Story[]> = {};
    
    stories?.forEach((story) => {
      const key = story[category];
      if (!groupedStories[key]) {
        groupedStories[key] = [];
      }
      groupedStories[key].push(story);
    });
    
    return groupedStories;
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold mb-6">Story Directory</h2>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="age">
          <AccordionTrigger className="text-xl font-semibold">By Age Group</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {ageGroups.map((age) => {
                const ageStories = getStoriesByCategory("age_group")[age.value] || [];
                return (
                  <div key={age.value} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">{age.label}</h3>
                    <div className="grid gap-4">
                      {ageStories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="genre">
          <AccordionTrigger className="text-xl font-semibold">By Genre</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {Object.values(genresByAge).flat().map((genre) => {
                const genreStories = getStoriesByCategory("genre")[genre.value] || [];
                return (
                  <div key={genre.value} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">{genre.label}</h3>
                    <div className="grid gap-4">
                      {genreStories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="moral">
          <AccordionTrigger className="text-xl font-semibold">By Moral Lesson</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {Object.values(moralsByAge).flat().map((moral) => {
                const moralStories = getStoriesByCategory("moral")[moral.value] || [];
                return (
                  <div key={moral.value} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">{moral.label}</h3>
                    <div className="grid gap-4">
                      {moralStories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{story.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{story.content}</p>
        <div className="mt-2 flex gap-2 text-xs">
          <span className="text-blue-600">Age: {story.age_group}</span>
          <span className="text-green-600">Genre: {story.genre}</span>
          <span className="text-purple-600">Moral: {story.moral}</span>
        </div>
      </CardContent>
    </Card>
  );
}