import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Image, Loader2 } from "lucide-react";
import { type VideoAspectRatio } from "../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BackgroundStepProps {
  imageGenerated: boolean;
  isGeneratingImage: boolean;
  selectedAspectRatio: VideoAspectRatio | '';
  backgroundImage: string;
  onGenerateBackground: () => Promise<void>;
  storyId: string;
}

export function BackgroundStep({
  imageGenerated,
  isGeneratingImage,
  selectedAspectRatio,
  backgroundImage,
  onGenerateBackground,
  storyId
}: BackgroundStepProps) {
  // Query to fetch existing video background
  const { data: existingVideo, isLoading } = useQuery({
    queryKey: ['video-background', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from('story_videos')
        .select('video_url')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Background Image</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          {imageGenerated || existingVideo?.video_url ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Background image ready</span>
            </div>
          ) : (
            <Button 
              onClick={() => onGenerateBackground()}
              disabled={!selectedAspectRatio || isGeneratingImage || isLoading}
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate Background Image</>
              )}
            </Button>
          )}
        </div>
        
        {(backgroundImage || existingVideo?.video_url) && (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <AspectRatio ratio={selectedAspectRatio === "16:9" ? 16/9 : 9/16}>
              <img 
                src={backgroundImage || existingVideo?.video_url} 
                alt="Generated background"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        )}
      </div>
    </div>
  );
}