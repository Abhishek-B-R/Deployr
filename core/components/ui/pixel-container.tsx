import * as React from "react";
import { cn } from "@/lib/utils";

export interface PixelContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "grid" | "dots" | "scanlines";
}

const PixelContainer = React.forwardRef<HTMLDivElement, PixelContainerProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "",
      grid: "pixel-grid-bg",
      dots: "pixel-dots-bg",
      scanlines: "pixel-scanlines",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
PixelContainer.displayName = "PixelContainer";

export { PixelContainer };
