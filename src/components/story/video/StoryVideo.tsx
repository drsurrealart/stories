import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VideoGenerationForm } from "./VideoGenerationForm";
import { VideoControls } from "./VideoControls";

type VideoAspectRatio = "16:9" | "9:16";

interface StoryVideoProps {
  storyId: string;
  storyContent: string;
}

export function StoryVideo({ storyId, storyContent }: StoryVideoProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: videoData } = useQuery({
    queryKey: ['story-video', storyId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('story_videos')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        const { data: { publicUrl } } = await supabase
          .storage
          .from('story-videos')
          .getPublicUrl(data.video_url);
        
        return { ...data, video_url: publicUrl };
      }
      
      return null;
    },
  });

  const handleCreateVideo = async (aspectRatio: VideoAspectRatio) => {
    try {
      setIsGenerating(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create video stories.",
          variant: "destructive",
        });
        return;
      }

      // Get current month's credits
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: userCredits } = await supabase
        .from('user_story_counts')
        .select('credits_used')
        .eq('user_id', session.user.id)
        .eq('month_year', currentMonth)
        .maybeSingle();

      // Get video credits cost
      const creditCost = 10;
      const currentCredits = userCredits?.credits_used || 0;

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

      if (creditError) {
        throw new Error('Failed to update credits');
      }

      toast({
        title: "Generating video",
        description: "Please wait while we create your video...",
      });

      // Generate video using the edge function
      const { data, error } = await supabase.functions.invoke('generate-story-video', {
        body: { 
          storyId,
          aspectRatio,
          storyContent 
        },
      });

      if (error) throw error;

      if (!data?.videoUrl) {
        throw new Error('No video URL received');
      }

      // Save to Supabase
      const { error: saveError } = await supabase
        .from('story_videos')
        .insert({
          story_id: storyId,
          user_id: session.user.id,
          video_url: data.videoUrl,
          aspect_ratio: aspectRatio,
          credits_used: creditCost
        });

      if (saveError) throw saveError;

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['story-video', storyId] });
      queryClient.invalidateQueries({ queryKey: ['user-story-limits'] });

      toast({
        title: "Success",
        description: "Video story created successfully!",
      });

    } catch (error: any) {
      console.error('Error creating video:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create video story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <Card className="p-4 md:p-6 space-y-4 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Video className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Story Video</h3>
      </div>

      {!videoData ? (
        <VideoGenerationForm
          isGenerating={isGenerating}
          showConfirmDialog={showConfirmDialog}
          onConfirmDialogChange={setShowConfirmDialog}
          onGenerate={handleCreateVideo}
        />
      ) : (
        <>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
            <video
              src={videoData.video_url}
              controls
              className="w-full h-full object-contain"
              poster="/placeholder.svg"
            />
          </div>
          <VideoControls 
            storyId={storyId} 
            videoUrl={videoData.video_url} 
          />
        </>
      )}
    </Card>
  );
}