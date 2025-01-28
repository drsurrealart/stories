import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, GraduationCap } from "lucide-react";

interface StoryMetaProps {
  ageGroup?: string;
  genre?: string;
  readingLevel?: string;
  lengthPreference?: string;
  language?: string;
  tone?: string;
}

export function StoryMeta({ 
  ageGroup, 
  genre, 
  readingLevel, 
  lengthPreference,
  language,
  tone 
}: StoryMetaProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {ageGroup && (
        <Badge variant="secondary" className="capitalize">
          <BookOpen className="h-3 w-3 mr-1" />
          {ageGroup}
        </Badge>
      )}
      {genre && (
        <Badge variant="secondary" className="capitalize">
          {genre}
        </Badge>
      )}
      {readingLevel && readingLevel !== "intermediate" && (
        <Badge variant="secondary" className="capitalize">
          <GraduationCap className="h-3 w-3 mr-1" />
          {readingLevel} level
        </Badge>
      )}
      {lengthPreference && lengthPreference !== "medium" && (
        <Badge variant="secondary" className="capitalize">
          <Clock className="h-3 w-3 mr-1" />
          {lengthPreference} length
        </Badge>
      )}
      {language && language !== "english" && (
        <Badge variant="secondary" className="capitalize">
          {language}
        </Badge>
      )}
      {tone && tone !== "standard" && (
        <Badge variant="secondary" className="capitalize">
          {tone}
        </Badge>
      )}
    </div>
  );
}