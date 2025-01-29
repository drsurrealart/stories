import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type VideoAspectRatio } from "../types";

interface VideoFormatStepProps {
  selectedAspectRatio: VideoAspectRatio | '';
  onAspectRatioChange: (value: VideoAspectRatio) => void;
}

export function VideoFormatStep({ selectedAspectRatio, onAspectRatioChange }: VideoFormatStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Video Format</h3>
      <Select 
        value={selectedAspectRatio} 
        onValueChange={onAspectRatioChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select aspect ratio" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="16:9">
            <div className="flex flex-col">
              <span>Landscape (16:9)</span>
              <span className="text-sm text-muted-foreground">Best for YouTube, Desktop</span>
            </div>
          </SelectItem>
          <SelectItem value="9:16">
            <div className="flex flex-col">
              <span>Portrait (9:16)</span>
              <span className="text-sm text-muted-foreground">Best for Stories, TikTok</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}