import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { genresByAge } from "@/data/storyOptions";

interface GenreSelectProps {
  value: string;
  onChange: (value: string) => void;
  ageGroup: string;
}

export function GenreSelect({ value, onChange, ageGroup }: GenreSelectProps) {
  const genres = ageGroup ? genresByAge[ageGroup as keyof typeof genresByAge] : [];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Choose your genre</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a genre" />
        </SelectTrigger>
        <SelectContent>
          {genres.map((genre) => (
            <SelectItem key={genre.value} value={genre.value}>
              {genre.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}