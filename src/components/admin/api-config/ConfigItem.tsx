import { Switch } from "@/components/ui/switch";
import { CreditCostInput } from "./CreditCostInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ConfigItemProps {
  config: {
    id: string;
    key_name: string;
    description: string | null;
    is_active: boolean;
    kids_story_credits_cost: number | null;
    image_generation_provider?: string;
  };
  onToggle: (id: string, checked: boolean) => void;
  onUpdateCreditsCost: (id: string, cost: number) => void;
  onUpdateProvider?: (id: string, provider: string) => void;
}

export const ConfigItem = ({ 
  config, 
  onToggle, 
  onUpdateCreditsCost,
  onUpdateProvider 
}: ConfigItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-grow">
        <p className="font-medium">{config.key_name}</p>
        {config.description && (
          <p className="text-sm text-gray-500">{config.description}</p>
        )}
        {config.key_name === "AUDIO_STORY_CREDITS" && (
          <CreditCostInput
            label="Kids Story Credits Cost"
            value={config.kids_story_credits_cost || 0}
            onChange={(cost) => onUpdateCreditsCost(config.id, cost)}
          />
        )}
        {config.key_name === "RUNWARE_API_KEY" && onUpdateProvider && (
          <div className="mt-2">
            <Select
              value={config.image_generation_provider}
              onValueChange={(value) => onUpdateProvider(config.id, value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="runware">Runware</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={config.is_active}
          onCheckedChange={(checked) => onToggle(config.id, checked)}
        />
        <span className="text-sm">
          {config.is_active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
};