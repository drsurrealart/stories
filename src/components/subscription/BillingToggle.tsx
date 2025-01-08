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
            : 'bg-gray-100 text-muted-foreground hover:bg-secondary'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => setIsYearly(true)}
        className={`px-4 py-2 rounded-md transition-colors ${
          isYearly
            ? 'bg-primary text-primary-foreground'
            : 'bg-gray-100 text-muted-foreground hover:bg-secondary'
        }`}
      >
        Yearly
      </button>
    </div>
  );
};