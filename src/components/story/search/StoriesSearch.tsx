import { SearchBar } from "@/components/story/SearchBar";
import { StoryFilters } from "@/components/story/filters/StoryFilters";

interface StoriesSearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedAgeGroups: string[];
  selectedGenres: string[];
  selectedLanguages: string[];
  onFilterChange: (value: string, isChecked: boolean, filterType: 'age' | 'genre' | 'language') => void;
}

export function StoriesSearch({
  searchQuery,
  onSearch,
  selectedAgeGroups,
  selectedGenres,
  selectedLanguages,
  onFilterChange,
}: StoriesSearchProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <SearchBar 
          searchQuery={searchQuery}
          onSearch={onSearch}
        />
      </div>
      <StoryFilters
        selectedAgeGroups={selectedAgeGroups}
        selectedGenres={selectedGenres}
        selectedLanguages={selectedLanguages}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}