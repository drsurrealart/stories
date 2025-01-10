import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb } from "lucide-react";

interface StoryContentProps {
  title: string;
  content: string;
  moral: string;
  ageGroup?: string;
  genre?: string;
  language?: string;
  tone?: string;
}

export function StoryContent({ 
  title, 
  content, 
  moral,
  ageGroup,
  genre,
  language,
  tone 
}: StoryContentProps) {
  return (
    <>
      <div className="prose max-w-none">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
        <div className="text-story-text leading-relaxed whitespace-pre-wrap text-sm md:text-base">
          {content}
        </div>
      </div>

      {moral && (
        <Card className="bg-secondary p-4 md:p-6 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Moral</h3>
          </div>
          <p className="text-story-text">{moral}</p>
        </Card>
      )}

      {(ageGroup || genre || language || tone) && (
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
    </>
  );
}