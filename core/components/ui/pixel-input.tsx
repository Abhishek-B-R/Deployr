import * as React from "react";
import { cn } from "@/lib/utils";

export interface PixelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PixelInput = React.forwardRef<HTMLInputElement, PixelInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-none border-4 border-foreground bg-background px-4 py-3 text-base font-pixel text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.2)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
PixelInput.displayName = "PixelInput";

export { PixelInput };
