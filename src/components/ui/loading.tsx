import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  text?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function Loading({ text = "Loading...", className, size = "default" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-2 animate-fade-in",
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-primary",
        sizeClasses[size]
      )} />
      {text && (
        <p className={cn(
          "text-muted-foreground",
          {
            "text-sm": size === "sm",
            "text-base": size === "default",
            "text-lg": size === "lg"
          }
        )}>
          {text}
        </p>
      )}
    </div>
  );
}