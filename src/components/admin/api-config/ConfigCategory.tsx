
import { APIConfig } from "./types";
import { ConfigItem } from "./ConfigItem";

interface ConfigCategoryProps {
  configs: APIConfig[];
  onToggle: (id: string, checked: boolean) => void;
  onUpdateCreditsCost: (id: string, cost: number) => void;
  onUpdateProvider: (id: string, provider: string) => void;
}

export const ConfigCategory = ({ 
  configs,
  onToggle,
  onUpdateCreditsCost,
  onUpdateProvider,
}: ConfigCategoryProps) => {
  return (
    <div className="space-y-4">
      {configs.map((config) => (
        <ConfigItem
          key={config.id}
          config={config}
          onToggle={onToggle}
          onUpdateCreditsCost={onUpdateCreditsCost}
          onUpdateProvider={onUpdateProvider}
        />
      ))}
    </div>
  );
};

