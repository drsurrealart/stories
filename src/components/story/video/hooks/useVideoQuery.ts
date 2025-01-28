import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useVideoQuery = (storyId: string) => {
  return useQuery({
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
};