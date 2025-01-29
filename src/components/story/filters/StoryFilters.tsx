import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface StoryFiltersProps {
  selectedAgeGroups: string[];
  selectedGenres: string[];
  selectedLanguages: string[];
  onFilterChange: (value: string, isChecked: boolean, filterType: 'age' | 'genre' | 'language') => void;
}

export function StoryFilters({
  selectedAgeGroups,
  selectedGenres,
  selectedLanguages,
  onFilterChange,
}: StoryFiltersProps) {
  return (
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
                    onFilterChange(age, checked as boolean, 'age')
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
                    onFilterChange(genre, checked as boolean, 'genre')
                  }
                />
                <Label htmlFor={`genre-${genre}`}>{genre}</Label>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Languages</h3>
            {['english', 'spanish', 'french', 'german', 'italian'].map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`language-${language}`}
                  checked={selectedLanguages.includes(language)}
                  onCheckedChange={(checked) => 
                    onFilterChange(language, checked as boolean, 'language')
                  }
                />
                <Label htmlFor={`language-${language}`}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}