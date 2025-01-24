import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreditCostInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export const CreditCostInput = ({ label, value, onChange }: CreditCostInputProps) => {
  return (
    <div className="mt-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
      <div className="flex items-center gap-2 mt-1">
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type="number"
          min="0"
          value={value || 0}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-24"
        />
        <span className="text-sm text-gray-500">credits</span>
      </div>
    </div>
  );
};