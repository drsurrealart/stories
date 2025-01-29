import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Image, Loader2 } from "lucide-react";
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
  // Query to fetch existing story images for both aspect ratios
  const { data: storyImages, isLoading } = useQuery({
    queryKey: ['story-images', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from('story_images')
        .select('image_url, aspect_ratio')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id);

      if (!data) return null;

      // Create an object with both aspect ratios if available
      return data.reduce((acc, img) => ({
        ...acc,
        [img.aspect_ratio]: img.image_url
      }), {} as Record<string, string>);
    },
  });

  // Get the image URL for the currently selected aspect ratio
  const currentImage = selectedAspectRatio ? storyImages?.[selectedAspectRatio] : null;
  const hasValidImage = imageGenerated || !!currentImage || !!backgroundImage;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Background Image</h3>
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading existing images...</span>
          </div>
        ) : hasValidImage ? (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <AspectRatio ratio={selectedAspectRatio === "16:9" ? 16/9 : 9/16}>
              <img 
                src={backgroundImage || currentImage} 
                alt="Story background"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            <Button 
              onClick={onGenerateBackground}
              disabled={!selectedAspectRatio || isGeneratingImage}
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
          </div>
        )}
      </div>
    </div>
  );
}