import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { StoryCard } from "./StoryCard";
import { StoryCategorySidebar } from "./StoryCategorySidebar";

type Story = {
  id: string;
  title: string;
  content: string;
  age_group: string;
  genre: string;
  moral: string;
  created_at: string;
};

type CategoryType = "age_group" | "genre" | "moral";

export function StoryDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("age_group");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const { data: stories, isLoading, error } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      console.log("Fetching stories...");
      try {
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (!data) {
          console.log("No stories found");
          return [];
        }

        console.log("Successfully fetched stories:", data);
        return data as Story[];
      } catch (err) {
        console.error("Error in query function:", err);
        throw err;
      }
    },
  });

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="text-center p-6 text-red-600">
        Error loading stories. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-6">
        Loading stories...
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <StoryCategorySidebar
          selectedCategory={selectedCategory}
          selectedValue={selectedValue}
          onCategoryChange={setSelectedCategory}
          onValueChange={setSelectedValue}
        />
        <main className="flex-1 p-6">
          <div className="text-center text-muted-foreground">
            No stories found. Create your first story!
          </div>
        </main>
      </div>
    );
  }

  const filteredStories = stories.filter((story) => {
    if (!selectedValue) return true;
    return story[selectedCategory] === selectedValue;
  });

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <StoryCategorySidebar
        selectedCategory={selectedCategory}
        selectedValue={selectedValue}
        onCategoryChange={setSelectedCategory}
        onValueChange={setSelectedValue}
      />

      <main className="flex-1 p-6 overflow-auto">
        <ScrollArea className="h-full">
          <div className="space-y-6">
            {filteredStories.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No stories found for the selected category.
              </div>
            ) : (
              filteredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}