import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  canProceed,
  onNext,
  onBack,
}: StepNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1}
      >
        Back
      </Button>
      <Button
        onClick={onNext}
        disabled={!canProceed}
      >
        Next
      </Button>
    </div>
  );
}