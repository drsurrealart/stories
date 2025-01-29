import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative after:absolute after:left-[1.3rem] after:top-[1.75rem] after:h-[calc(100%-2rem)] after:w-[2px] after:bg-muted">
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;

          return (
            <div key={step.title} className="relative flex gap-4 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background shadow">
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                ) : (
                  <span className={cn(
                    "text-sm font-semibold",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}>
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-sm font-semibold",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}