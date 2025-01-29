import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ImageStyle = {
  id: string;
  label: string;
  description: string;
};

export const IMAGE_STYLES: ImageStyle[] = [
  {
    id: "realistic",
    label: "Realistic",
    description: "Photorealistic style with natural lighting and details"
  },
  {
    id: "watercolor",
    label: "Watercolor",
    description: "Soft, artistic watercolor painting style"
  },
  {
    id: "cartoon",
    label: "Cartoon",
    description: "Fun and vibrant cartoon illustration style"
  },
  {
    id: "3d",
    label: "3D Animation",
    description: "Modern 3D rendered style"
  },
  {
    id: "storybook",
    label: "Storybook",
    description: "Classic children's book illustration style"
  },
  {
    id: "fantasy",
    label: "Fantasy Art",
    description: "Magical and ethereal fantasy art style"
  }
];

interface ImageStyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  disabled?: boolean;
}

export function ImageStyleSelector({ selectedStyle, onStyleChange, disabled }: ImageStyleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Image Style</label>
      <Select
        value={selectedStyle}
        onValueChange={onStyleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an image style" />
        </SelectTrigger>
        <SelectContent>
          {IMAGE_STYLES.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              <div className="flex flex-col">
                <span>{style.label}</span>
                <span className="text-xs text-muted-foreground">{style.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}