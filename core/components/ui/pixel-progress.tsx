import * as React from "react";
import { cn } from "@/lib/utils";

export interface PixelProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "yellow" | "red" | "blue";
}

const PixelProgress = React.forwardRef<HTMLDivElement, PixelProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const variantColors = {
      default: "bg-[var(--pixel-green)]",
      yellow: "bg-[var(--pixel-yellow)]",
      red: "bg-[var(--pixel-red)]",
      blue: "bg-[var(--pixel-blue)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-8 w-full overflow-hidden rounded-none border-4 border-foreground bg-background",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out shadow-[inset_-2px_-2px_0_0_rgba(0,0,0,0.3)]",
            variantColors[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
PixelProgress.displayName = "PixelProgress";

export { PixelProgress };
