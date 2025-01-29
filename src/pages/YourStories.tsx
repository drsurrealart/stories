import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavigationBar } from "@/components/NavigationBar";
import { useToast } from "@/hooks/use-toast";
import { SavedStory } from "@/types/story";
import { useSearchParams } from "react-router-dom";
import { StoriesList } from "@/components/story/StoriesList";
import { StoryPagination } from "@/components/story/StoryPagination";
import { StoriesHeader } from "@/components/story/header/StoriesHeader";
import { StoriesSearch } from "@/components/story/search/StoriesSearch";

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
    let filtered = [...stories];

    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(searchTerm) ||
        story.content.toLowerCase().includes(searchTerm) ||
        story.moral.toLowerCase().includes(searchTerm)
      );
    }

    if (ageGroups.length > 0) {
      filtered = filtered.filter(story => ageGroups.includes(story.age_group));
    }

    if (genres.length > 0) {
      filtered = filtered.filter(story => genres.includes(story.genre));
    }

    if (languages.length > 0) {
      filtered = filtered.filter(story => story.language && languages.includes(story.language.toLowerCase()));
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

    applyFilters(
      searchQuery,
      filterType === 'age' ? updatedFilter : selectedAgeGroups,
      filterType === 'genre' ? updatedFilter : selectedGenres,
      filterType === 'language' ? updatedFilter : selectedLanguages
    );
  };

  const handleDelete = async (storyId: string) => {
    try {
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
        <StoriesHeader />
        
        <StoriesSearch 
          searchQuery={searchQuery}
          onSearch={handleSearch}
          selectedAgeGroups={selectedAgeGroups}
          selectedGenres={selectedGenres}
          selectedLanguages={selectedLanguages}
          onFilterChange={handleFilterChange}
        />

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
