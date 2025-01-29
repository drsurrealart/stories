import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AudioStory } from "@/components/story/AudioStory";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AudioListProps {
  audioStories: any[];
  onDelete: (audioId: string) => void;
}

const pastelColors = [
  "bg-[#F2FCE2]", // Soft Green
  "bg-[#FEF7CD]", // Soft Yellow
  "bg-[#FEC6A1]", // Soft Orange
  "bg-[#E5DEFF]", // Soft Purple
  "bg-[#FFDEE2]", // Soft Pink
  "bg-[#FDE1D3]", // Soft Peach
  "bg-[#D3E4FD]", // Soft Blue
  "bg-[#F1F0FB]", // Soft Gray
];

export const AudioList = ({ audioStories, onDelete }: AudioListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!audioStories?.length) {
    return (
      <div className="text-center text-gray-500">
        You haven't created any audio stories yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {audioStories.map((audio, index) => (
        <Card 
          key={audio.id} 
          className={`p-6 ${pastelColors[index % pastelColors.length]} hover:shadow-lg transition-shadow`}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-semibold">{audio.stories.title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(audio.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-white/50 rounded-lg p-6 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Story Moral</h3>
            </div>
            <p className="text-muted-foreground">{audio.stories.moral}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {audio.stories.age_group && (
              <Badge variant="secondary">
                {audio.stories.age_group}
              </Badge>
            )}
            {audio.stories.genre && (
              <Badge variant="secondary">
                {audio.stories.genre}
              </Badge>
            )}
          </div>

          <AudioStory 
            storyId={audio.stories.id} 
            storyContent={audio.stories.content}
          />

          <div className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/your-stories?story=${audio.stories.id}`)}
              className="w-full"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Read Story
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};