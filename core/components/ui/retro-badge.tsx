import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const retroBadgeVariants = cva(
  "inline-flex items-center rounded-none border-2 font-pixel text-[10px] tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[var(--pixel-green-dark)] bg-[var(--pixel-green)] text-white shadow-[inset_-2px_-2px_0_0_var(--pixel-green-dark)]",
        yellow:
          "border-[var(--pixel-yellow-dark)] bg-[var(--pixel-yellow)] text-black shadow-[inset_-2px_-2px_0_0_var(--pixel-yellow-dark)]",
        red:
          "border-[var(--pixel-red-dark)] bg-[var(--pixel-red)] text-white shadow-[inset_-2px_-2px_0_0_var(--pixel-red-dark)]",
        blue:
          "border-[var(--pixel-blue-dark)] bg-[var(--pixel-blue)] text-white shadow-[inset_-2px_-2px_0_0_var(--pixel-blue-dark)]",
        outline: "border-current bg-transparent text-foreground",
        ghost: "border-transparent bg-transparent text-foreground hover:border-current",
      },
      size: {
        default: "px-3 py-1.5",
        sm: "px-2 py-1 text-[8px]",
        lg: "px-4 py-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface RetroBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof retroBadgeVariants> {}

function RetroBadge({ className, variant, size, ...props }: RetroBadgeProps) {
  return (
    <div className={cn(retroBadgeVariants({ variant, size }), className)} {...props} />
  );
}

export { RetroBadge, retroBadgeVariants };
