import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Headphones, Image, FileText, Video } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MediaPreviewModal } from "../media/MediaPreviewModal";
import { VideoAspectRatio } from "../video/types";

interface StoryAssetStatusProps {
  storyId: string;
}

type TableNames = 'audio_stories' | 'story_images' | 'story_videos' | 'story_pdfs';

interface BaseAsset {
  id: string;
  story_id: string;
  user_id: string;
  credits_used: number;
  created_at: string;
  updated_at: string;
}

interface AudioAsset extends BaseAsset {
  audio_url: string;
  voice_id: string;
}

interface ImageAsset extends BaseAsset {
  image_url: string;
  aspect_ratio: string;
}

interface VideoAsset extends BaseAsset {
  video_url: string;
  aspect_ratio: VideoAspectRatio;
}

interface PDFAsset extends BaseAsset {
  pdf_url: string;
}

interface AssetStatus {
  icon: React.ReactNode;
  label: string;
  queryKey: string;
  table: TableNames;
  mediaType: "audio" | "image" | "video" | "pdf";
}

const assets: AssetStatus[] = [
  { 
    icon: <Headphones className="h-4 w-4" />, 
    label: "Audio Story", 
    queryKey: "audio", 
    table: "audio_stories",
    mediaType: "audio"
  },
  { 
    icon: <Image className="h-4 w-4" />, 
    label: "Story Image", 
    queryKey: "image", 
    table: "story_images",
    mediaType: "image"
  },
  { 
    icon: <Video className="h-4 w-4" />, 
    label: "Story Video", 
    queryKey: "video", 
    table: "story_videos",
    mediaType: "video"
  },
  { 
    icon: <FileText className="h-4 w-4" />, 
    label: "Story PDF", 
    queryKey: "pdf", 
    table: "story_pdfs",
    mediaType: "pdf"
  },
];

export function StoryAssetStatus({ storyId }: StoryAssetStatusProps) {
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "audio" | "image" | "video" | "pdf";
    url: string;
    aspectRatio?: VideoAspectRatio;
  } | null>(null);

  const assetQueries = assets.map(asset => ({
    ...asset,
    query: useQuery({
      queryKey: ['story-asset', asset.queryKey, storyId],
      queryFn: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const { data } = await supabase
          .from(asset.table)
          .select('*')
          .eq('story_id', storyId)
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (data) {
          const storageKey = {
            audio_stories: 'audio_url',
            story_images: 'image_url',
            story_videos: 'video_url',
            story_pdfs: 'pdf_url'
          }[asset.table];

          const { data: { publicUrl } } = supabase
            .storage
            .from(asset.table.replace('_', '-'))
            .getPublicUrl(data[storageKey]);

          return {
            ...data,
            publicUrl,
            // Only include aspectRatio for video and image assets
            ...(('aspect_ratio' in data) && { 
              aspectRatio: asset.mediaType === 'video' 
                ? data.aspect_ratio as VideoAspectRatio 
                : data.aspect_ratio 
            })
          };
        }
        
        return null;
      },
    })
  }));

  const handleAssetClick = (asset: typeof assets[0], data: any) => {
    if (data) {
      setSelectedMedia({
        type: asset.mediaType,
        url: data.publicUrl,
        ...(data.aspectRatio && { aspectRatio: data.aspectRatio as VideoAspectRatio })
      });
    }
  };

  return (
    <>
      <div className="flex gap-3 mt-2">
        <TooltipProvider>
          {assetQueries.map((asset, index) => (
            <Tooltip key={index}>
              <TooltipTrigger>
                <div 
                  className={`p-1.5 rounded-full transition-colors cursor-pointer hover:scale-110 ${
                    asset.query.data 
                      ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  onClick={() => asset.query.data && handleAssetClick(asset, asset.query.data)}
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

      {selectedMedia && (
        <MediaPreviewModal
          isOpen={true}
          onClose={() => setSelectedMedia(null)}
          mediaType={selectedMedia.type}
          mediaUrl={selectedMedia.url}
          aspectRatio={selectedMedia.aspectRatio}
        />
      )}
    </>
  );
}