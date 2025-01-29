import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavigationBar } from "@/components/NavigationBar";
import { useToast } from "@/hooks/use-toast";
import { SavedStory } from "@/types/story";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/story/SearchBar";
import { StoriesList } from "@/components/story/StoriesList";
import { StoryPagination } from "@/components/story/StoryPagination";
import { Book, BookOpen, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const STORIES_PER_PAGE = 5;

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
  const navigate = useNavigate();

  // Filter states
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

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
    applyFilters(query, selectedAgeGroups, selectedGenres, selectedLanguages);
  };

  const applyFilters = (
    query: string,
    ageGroups: string[],
    genres: string[],
    languages: string[]
  ) => {
    let filtered = stories;

    // Apply text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(searchTerm) ||
        story.content.toLowerCase().includes(searchTerm) ||
        story.moral.toLowerCase().includes(searchTerm)
      );
    }

    // Apply age group filter
    if (ageGroups.length > 0) {
      filtered = filtered.filter(story => ageGroups.includes(story.age_group));
    }

    // Apply genre filter
    if (genres.length > 0) {
      filtered = filtered.filter(story => genres.includes(story.genre));
    }

    // Apply language filter
    if (languages.length > 0) {
      filtered = filtered.filter(story => languages.includes(story.language));
    }

    setFilteredStories(filtered);
    setTotalStories(filtered.length);
  };

  const handleFilterChange = (
    value: string,
    isChecked: boolean,
    filterType: 'age' | 'genre' | 'language'
  ) => {
    let updatedFilter: string[] = [];
    switch (filterType) {
      case 'age':
        updatedFilter = isChecked
          ? [...selectedAgeGroups, value]
          : selectedAgeGroups.filter(item => item !== value);
        setSelectedAgeGroups(updatedFilter);
        break;
      case 'genre':
        updatedFilter = isChecked
          ? [...selectedGenres, value]
          : selectedGenres.filter(item => item !== value);
        setSelectedGenres(updatedFilter);
        break;
      case 'language':
        updatedFilter = isChecked
          ? [...selectedLanguages, value]
          : selectedLanguages.filter(item => item !== value);
        setSelectedLanguages(updatedFilter);
        break;
    }
    applyFilters(searchQuery, 
      filterType === 'age' ? updatedFilter : selectedAgeGroups,
      filterType === 'genre' ? updatedFilter : selectedGenres,
      filterType === 'language' ? updatedFilter : selectedLanguages
    );
  };

  const handleDelete = async (storyId: string) => {
    try {
      // Delete audio stories
      const { error: audioError } = await supabase
        .from('audio_stories')
        .delete()
        .eq('story_id', storyId);

      if (audioError) throw audioError;

      // Delete story images
      const { error: imageError } = await supabase
        .from('story_images')
        .delete()
        .eq('story_id', storyId);

      if (imageError) throw imageError;

      // Delete story PDFs
      const { error: pdfError } = await supabase
        .from('story_pdfs')
        .delete()
        .eq('story_id', storyId);

      if (pdfError) throw pdfError;

      // Delete story translations where this story is either the original or the translation
      const { error: translationError1 } = await supabase
        .from('story_translations')
        .delete()
        .eq('original_story_id', storyId);

      if (translationError1) throw translationError1;

      const { error: translationError2 } = await supabase
        .from('story_translations')
        .delete()
        .eq('translated_story_id', storyId);

      if (translationError2) throw translationError2;

      // Delete story favorites
      const { error: favoriteError } = await supabase
        .from('story_favorites')
        .delete()
        .eq('story_id', storyId);

      if (favoriteError) throw favoriteError;

      // Finally, delete the story itself
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;

      // Update local state after successful deletion
      const updatedStories = stories.filter(story => story.id !== storyId);
      setStories(updatedStories);
      
      // Update filtered stories and maintain search results
      const updatedFilteredStories = filteredStories.filter(story => story.id !== storyId);
      setFilteredStories(updatedFilteredStories);
      setTotalStories(updatedFilteredStories.length);

      toast({
        title: "Success",
        description: "Story and all associated content deleted successfully",
      });

      // Adjust current page if necessary
      const newTotalPages = Math.ceil(updatedFilteredStories.length / STORIES_PER_PAGE);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <NavigationBar onLogout={async () => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <Book className="h-8 w-8 text-primary animate-bounce" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
              My Stories
            </h1>
            <BookOpen className="h-8 w-8 text-primary animate-bounce" />
          </div>
          <p className="text-lg text-muted-foreground">
            Your personal collection of magical stories that inspire and delight.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => navigate('/stories-list')}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              View Stories List
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchBar 
              searchQuery={searchQuery}
              onSearch={handleSearch}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Stories</SheetTitle>
                <SheetDescription>
                  Select filters to narrow down your stories
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Age Groups</h3>
                  {['3-5', '6-8', '9-12', 'Teenager', 'Young Adult'].map((age) => (
                    <div key={age} className="flex items-center space-x-2">
                      <Checkbox
                        id={`age-${age}`}
                        checked={selectedAgeGroups.includes(age)}
                        onCheckedChange={(checked) => 
                          handleFilterChange(age, checked as boolean, 'age')
                        }
                      />
                      <Label htmlFor={`age-${age}`}>{age}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Genres</h3>
                  {['Adventure', 'Fantasy', 'Educational', 'Moral', 'Bedtime'].map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={(checked) => 
                          handleFilterChange(genre, checked as boolean, 'genre')
                        }
                      />
                      <Label htmlFor={`genre-${genre}`}>{genre}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Languages</h3>
                  {['English', 'Spanish', 'French', 'German', 'Italian'].map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={`language-${language}`}
                        checked={selectedLanguages.includes(language)}
                        onCheckedChange={(checked) => 
                          handleFilterChange(language, checked as boolean, 'language')
                        }
                      />
                      <Label htmlFor={`language-${language}`}>{language}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <StoryPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <StoriesList 
          stories={paginatedStories}
          isLoading={isLoading}
          searchQuery={searchQuery}
          highlightedStoryId={highlightedStoryId}
          storyRefs={storyRefs}
          onDelete={handleDelete}
        />

        <StoryPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default YourStories;
