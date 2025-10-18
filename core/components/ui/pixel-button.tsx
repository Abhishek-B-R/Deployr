import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pixelButtonVariants = cva(
  "inline-flex items-center justify-center font-pixel text-xs tracking-tight whitespace-nowrap rounded-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-4 relative",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--pixel-green)] text-white border-[var(--pixel-green-dark)] shadow-[inset_-4px_-4px_0_0_var(--pixel-green-dark)] hover:bg-[var(--pixel-green)] hover:shadow-[inset_-6px_-6px_0_0_var(--pixel-green-dark)] active:shadow-[inset_4px_4px_0_0_var(--pixel-green-dark)]",
        yellow:
          "bg-[var(--pixel-yellow)] text-black border-[var(--pixel-yellow-dark)] shadow-[inset_-4px_-4px_0_0_var(--pixel-yellow-dark)] hover:bg-[var(--pixel-yellow)] hover:shadow-[inset_-6px_-6px_0_0_var(--pixel-yellow-dark)] active:shadow-[inset_4px_4px_0_0_var(--pixel-yellow-dark)]",
        red:
          "bg-[var(--pixel-red)] text-white border-[var(--pixel-red-dark)] shadow-[inset_-4px_-4px_0_0_var(--pixel-red-dark)] hover:bg-[var(--pixel-red)] hover:shadow-[inset_-6px_-6px_0_0_var(--pixel-red-dark)] active:shadow-[inset_4px_4px_0_0_var(--pixel-red-dark)]",
        blue:
          "bg-[var(--pixel-blue)] text-white border-[var(--pixel-blue-dark)] shadow-[inset_-4px_-4px_0_0_var(--pixel-blue-dark)] hover:bg-[var(--pixel-blue)] hover:shadow-[inset_-6px_-6px_0_0_var(--pixel-blue-dark)] active:shadow-[inset_4px_4px_0_0_var(--pixel-blue-dark)]",
        outline:
          "bg-transparent border-current text-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 py-2 text-[10px]",
        lg: "h-14 px-8 py-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pixelButtonVariants> {
  asChild?: boolean;
}

const PixelButton = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(pixelButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
PixelButton.displayName = "PixelButton";

export { PixelButton, pixelButtonVariants };
