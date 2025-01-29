import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Headphones, Image, FileText, Video, FileCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StoryAssetStatusProps {
  storyId: string;
}

interface AssetStatus {
  icon: React.ReactNode;
  label: string;
  queryKey: string;
  table: string;
}

const assets: AssetStatus[] = [
  { icon: <Headphones className="h-4 w-4" />, label: "Audio Story", queryKey: "audio", table: "audio_stories" },
  { icon: <Image className="h-4 w-4" />, label: "Story Image", queryKey: "image", table: "story_images" },
  { icon: <Video className="h-4 w-4" />, label: "Story Video", queryKey: "video", table: "story_videos" },
  { icon: <FileText className="h-4 w-4" />, label: "Story PDF", queryKey: "pdf", table: "story_pdfs" },
];

export function StoryAssetStatus({ storyId }: StoryAssetStatusProps) {
  const assetQueries = assets.map(asset => ({
    ...asset,
    query: useQuery({
      queryKey: ['story-asset', asset.queryKey, storyId],
      queryFn: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const { data } = await supabase
          .from(asset.table)
          .select('id')
          .eq('story_id', storyId)
          .eq('user_id', session.user.id)
          .maybeSingle();

        return !!data;
      },
    })
  }));

  return (
    <div className="flex gap-3 mt-2">
      <TooltipProvider>
        {assetQueries.map((asset, index) => (
          <Tooltip key={index}>
            <TooltipTrigger>
              <div 
                className={`p-1.5 rounded-full transition-colors ${
                  asset.query.data 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {asset.icon}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{asset.label} {asset.query.data ? 'Generated' : 'Not Generated'}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}