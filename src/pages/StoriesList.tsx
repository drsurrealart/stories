import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavigationBar } from "@/components/NavigationBar";
import { SearchBar } from "@/components/story/SearchBar";
import { StoryPagination } from "@/components/story/StoryPagination";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book, ArrowLeft } from "lucide-react";
import { StoryAssetStatus } from "@/components/story/card/StoryAssetStatus";

const STORIES_PER_PAGE = 50;

const StoriesList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stories, isLoading } = useQuery({
    queryKey: ['stories-list'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from('stories')
        .select('id, title, moral')
        .eq('author_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.moral.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredStories.length / STORIES_PER_PAGE);
  const startIndex = (currentPage - 1) * STORIES_PER_PAGE;
  const paginatedStories = filteredStories.slice(startIndex, startIndex + STORIES_PER_PAGE);

  const handleReadStory = (storyId: string) => {
    navigate(`/your-stories?story=${storyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <NavigationBar onLogout={async () => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/your-stories')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Stories
          </Button>
        </div>

        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <Book className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
              Stories List
            </h1>
            <Book className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground">
            A quick overview of all your stories
          </p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        {isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-4">
            {paginatedStories.map((story) => (
              <Card key={story.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                      <h3 className="text-lg font-semibold">{story.title}</h3>
                      <p className="text-muted-foreground">{story.moral}</p>
                    </div>
                    <Button
                      onClick={() => handleReadStory(story.id)}
                      className="shrink-0"
                    >
                      Read Story
                    </Button>
                  </div>
                  <StoryAssetStatus storyId={story.id} />
                </div>
              </Card>
            ))}
          </div>
        )}

        <StoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default StoriesList;