import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ageGroups, genresByAge, moralsByAge } from "@/data/storyOptions";

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
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching stories:", error);
        throw error;
      }
      console.log("Fetched stories:", data);
      return data as Story[];
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

  const filteredStories = stories?.filter((story) => {
    if (!selectedValue) return true;
    return story[selectedCategory] === selectedValue;
  });

  const getCategoryItems = (category: CategoryType) => {
    switch (category) {
      case "age_group":
        return ageGroups;
      case "genre":
        return Object.values(genresByAge).flat();
      case "moral":
        return Object.values(moralsByAge).flat();
      default:
        return [];
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      setSelectedCategory("age_group");
                      setSelectedValue(null);
                    }}
                    data-active={selectedCategory === "age_group"}
                  >
                    Age Groups
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      setSelectedCategory("genre");
                      setSelectedValue(null);
                    }}
                    data-active={selectedCategory === "genre"}
                  >
                    Genres
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      setSelectedCategory("moral");
                      setSelectedValue(null);
                    }}
                    data-active={selectedCategory === "moral"}
                  >
                    Moral Lessons
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>{selectedCategory === "age_group" ? "Age Groups" : selectedCategory === "genre" ? "Genres" : "Moral Lessons"}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {getCategoryItems(selectedCategory).map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      onClick={() => setSelectedValue(item.value)}
                      data-active={selectedValue === item.value}
                    >
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1 p-6 overflow-auto">
        <ScrollArea className="h-full">
          <div className="space-y-6">
            {filteredStories?.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No stories found for the selected category.
              </div>
            ) : (
              filteredStories?.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))
            )}
          </div>
        </ScrollArea>
      </main>
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