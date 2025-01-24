import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavigationBar } from "@/components/NavigationBar";
import { useToast } from "@/hooks/use-toast";
import { StoryCard } from "@/components/story/StoryCard";
import { SavedStory } from "@/types/story";
import { Loading } from "@/components/ui/loading";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const STORIES_PER_PAGE = 3;

const YourStories = () => {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<SavedStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStories, setTotalStories] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const highlightedStoryId = searchParams.get('story');
  const storyRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const fetchStories = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { count } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', session.user.id);

      setTotalStories(count || 0);

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('author_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
      setFilteredStories(data || []);

      if (highlightedStoryId && data) {
        const storyIndex = data.findIndex(story => story.id === highlightedStoryId);
        if (storyIndex !== -1) {
          const page = Math.floor(storyIndex / STORIES_PER_PAGE) + 1;
          setCurrentPage(page);
        }
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast({
        title: "Error",
        description: "Failed to load your stories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (highlightedStoryId && storyRefs.current[highlightedStoryId]) {
      storyRefs.current[highlightedStoryId]?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [highlightedStoryId, currentPage, filteredStories]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    
    if (!query.trim()) {
      setFilteredStories(stories);
      setTotalStories(stories.length);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = stories.filter(story => 
      story.title.toLowerCase().includes(searchTerm) ||
      story.content.toLowerCase().includes(searchTerm) ||
      story.moral.toLowerCase().includes(searchTerm)
    );

    setFilteredStories(filtered);
    setTotalStories(filtered.length);
  };

  const handleDelete = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;

      const updatedStories = stories.filter(story => story.id !== storyId);
      setStories(updatedStories);
      handleSearch(searchQuery);

      toast({
        title: "Success",
        description: "Story deleted successfully",
      });

      const newTotalPages = Math.ceil(filteredStories.length / STORIES_PER_PAGE);
      if (currentPage > newTotalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Error",
        description: "Failed to delete the story",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.ceil(totalStories / STORIES_PER_PAGE);
  const startIndex = (currentPage - 1) * STORIES_PER_PAGE;
  const paginatedStories = filteredStories.slice(startIndex, startIndex + STORIES_PER_PAGE);

  const PaginationComponent = () => (
    <Pagination className="my-4">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(currentPage - 1)}
            />
          </PaginationItem>
        )}
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page} className="hidden md:inline-block">
            <PaginationLink
              onClick={() => setCurrentPage(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={async () => {}} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">My Stories</h1>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Search stories by title, content, or moral..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>

        {isLoading ? (
          <Loading text="Loading your stories..." />
        ) : filteredStories.length === 0 ? (
          <div className="text-center text-gray-500 p-4 bg-white/50 rounded-lg">
            {searchQuery ? "No stories found matching your search." : "You haven't saved any stories yet."}
          </div>
        ) : (
          <div className="space-y-4">
            {totalPages > 1 && <PaginationComponent />}
            
            {paginatedStories.map((story) => (
              <div
                key={story.id}
                ref={el => storyRefs.current[story.id] = el}
                className={`transition-all duration-300 ${
                  highlightedStoryId === story.id ? 'ring-2 ring-primary ring-offset-2 rounded-lg' : ''
                }`}
              >
                <StoryCard 
                  story={story}
                  onDelete={handleDelete}
                />
              </div>
            ))}

            {totalPages > 1 && <PaginationComponent />}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourStories;