import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ImageIcon, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AudioStory } from "@/components/story/AudioStory";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
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
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);

  const handleGenerateImage = async (storyId: string, storyContent: string) => {
    try {
      setGeneratingImage(storyId);
      
      // Get current month's credits
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to generate images.",
          variant: "destructive",
        });
        return;
      }

      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: userCredits } = await supabase
        .from('user_story_counts')
        .select('credits_used')
        .eq('user_id', session.user.id)
        .eq('month_year', currentMonth)
        .maybeSingle();

      // Get image credits cost
      const { data: config } = await supabase
        .from('api_configurations')
        .select('image_credits_cost')
        .eq('key_name', 'STORY_IMAGE_CREDITS')
        .maybeSingle();

      const creditCost = config?.image_credits_cost || 5;
      const currentCredits = userCredits?.credits_used || 0;

      // Generate image using the edge function
      const { data, error } = await supabase.functions.invoke('generate-story-image', {
        body: { prompt: storyContent }
      });

      if (error) throw error;

      if (!data?.imageUrl) {
        throw new Error('No image URL received');
      }

      // Upload to Supabase Storage
      const filename = `${crypto.randomUUID()}.jpg`;
      const response = await fetch(data.imageUrl);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('story-images')
        .upload(filename, blob);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = await supabase.storage
        .from('story-images')
        .getPublicUrl(filename);

      // Save to database
      const { error: dbError } = await supabase
        .from('story_images')
        .insert({
          story_id: storyId,
          user_id: session.user.id,
          image_url: filename,
          credits_used: creditCost
        });

      if (dbError) throw dbError;

      // Update credits
      const { error: creditError } = await supabase
        .from('user_story_counts')
        .upsert({
          user_id: session.user.id,
          month_year: currentMonth,
          credits_used: currentCredits + creditCost,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,month_year'
        });

      if (creditError) throw creditError;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['audio-stories'] });
      queryClient.invalidateQueries({ queryKey: ['user-story-limits'] });

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });

    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setGeneratingImage(null);
    }
  };

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

          {audio.image_url ? (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-4">
              <img
                src={`https://uhxpzeyklqbkeibvreqv.supabase.co/storage/v1/object/public/story-images/${audio.image_url}`}
                alt="Story illustration"
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-8 mb-4 space-y-4">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No image generated yet</p>
              </div>
              <Button
                variant="outline"
                onClick={() => handleGenerateImage(audio.stories.id, audio.stories.content)}
                disabled={generatingImage === audio.stories.id}
              >
                {generatingImage === audio.stories.id ? (
                  "Generating..."
                ) : (
                  "Generate Image"
                )}
              </Button>
            </div>
          )}

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