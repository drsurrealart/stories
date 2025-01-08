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
  console.log("StoryDirectory component rendering");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("age_group");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const { data: stories, isLoading, error } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      console.log("Starting story fetch...");
      try {
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase query error:", error);
          throw error;
        }

        console.log("Raw Supabase response:", { data, error });

        if (!data) {
          console.log("No data returned from Supabase");
          return [];
        }

        if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
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

  console.log("Current component state:", {
    stories,
    isLoading,
    error,
    selectedCategory,
    selectedValue
  });

  if (error) {
    console.error("Query error state:", error);
    return (
      <div className="text-center p-6 text-red-600">
        Error loading stories. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    console.log("Rendering loading state");
    return (
      <div className="text-center p-6">
        Loading stories...
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    console.log("No stories found, rendering empty state");
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

  console.log("Rendering stories:", {
    totalStories: stories.length,
    filteredCount: filteredStories.length,
    selectedCategory,
    selectedValue
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