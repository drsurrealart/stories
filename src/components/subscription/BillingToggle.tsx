import { Badge } from "@/components/ui/badge";

interface BillingToggleProps {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
}

export const BillingToggle = ({ isYearly, setIsYearly }: BillingToggleProps) => {
  return (
    <div className="flex justify-center items-center gap-6 bg-card p-2 rounded-lg shadow-sm max-w-xs mx-auto">
      <button
        onClick={() => setIsYearly(false)}
        className={`px-4 py-2 rounded-md transition-colors ${
          !isYearly
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-secondary'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => setIsYearly(true)}
        className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
          isYearly
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-secondary'
        }`}
      >
        Yearly
        <Badge className="bg-primary/10 text-primary-foreground">
          Save 20%
        </Badge>
      </button>
    </div>
  );
};