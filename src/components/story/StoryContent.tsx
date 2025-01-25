import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, Clock, GraduationCap } from "lucide-react";

interface StoryContentProps {
  title: string;
  content: string;
  moral: string;
  ageGroup?: string;
  genre?: string;
  language?: string;
  tone?: string;
  readingLevel?: string;
  lengthPreference?: string;
}

export function StoryContent({ 
  title, 
  content, 
  moral,
  ageGroup,
  genre,
  language,
  tone,
  readingLevel,
  lengthPreference
}: StoryContentProps) {
  return (
    <div className="space-y-4">
      {/* Story Content */}
      <div className="prose max-w-none">
        <p className="text-story-text whitespace-pre-line">{content}</p>
      </div>

      {moral && (
        <Card className="bg-secondary p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Moral</h3>
          </div>
          <p className="text-story-text">{moral}</p>
        </Card>
      )}

      {(ageGroup || genre || language || tone || readingLevel || lengthPreference) && (
        <div className="flex flex-wrap gap-2">
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
      )}
    </div>
  );
}