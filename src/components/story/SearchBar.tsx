import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearch }: SearchBarProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search stories by title, content, or moral..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
    </div>
  );
}