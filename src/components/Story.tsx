import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StoryContent } from "./story/StoryContent";
import { StoryActions } from "./story/StoryActions";
import { StorySocialShare } from "./story/StorySocialShare";
import { StoryEnrichment } from "./story/StoryEnrichment";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/ui/loading";

interface StoryProps {
  content: string;
  onReflect: () => void;
  onCreateNew: () => void;
}

export function Story({ content, onReflect, onCreateNew }: StoryProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Split content to separate moral from the rest of the story
  const parts = content.split("Moral:");
  const storyContent = parts[0].trim();
  const moral = parts[1]?.trim() || "";

  // Extract title from the first line of the story
  const titleMatch = storyContent.match(/^(.+?)\n/);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled Story";
  const storyWithoutTitle = storyContent.replace(/^.+?\n/, '').trim();

  return (
    <Card className="w-full max-w-2xl p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in bg-story-background">
      <StoryContent
        title={title}
        content={storyWithoutTitle}
        moral={moral}
      />

      <StoryEnrichment moral={moral} />

      <div className="border-t pt-4 md:pt-6 space-y-4">
        <StoryActions
          onReflect={onReflect}
          onCreateNew={onCreateNew}
        />
        <StorySocialShare
          title={title}
          content={storyWithoutTitle}
          moral={moral}
          url={window.location.href}
        />
      </div>
    </Card>
  );
}