import * as React from "react";
import { cn } from "@/lib/utils";

const PixelCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-none border-4 border-foreground bg-card text-card-foreground pixel-shadow",
      className
    )}
    {...props}
  />
));
PixelCard.displayName = "PixelCard";

const PixelCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b-4 border-foreground", className)}
    {...props}
  />
));
PixelCardHeader.displayName = "PixelCardHeader";

const PixelCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-pixel text-sm leading-none tracking-tight", className)}
    {...props}
  />
));
PixelCardTitle.displayName = "PixelCardTitle";

const PixelCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
PixelCardDescription.displayName = "PixelCardDescription";

const PixelCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
PixelCardContent.displayName = "PixelCardContent";

const PixelCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t-4 border-foreground", className)}
    {...props}
  />
));
PixelCardFooter.displayName = "PixelCardFooter";

export {
  PixelCard,
  PixelCardHeader,
  PixelCardFooter,
  PixelCardTitle,
  PixelCardDescription,
  PixelCardContent,
};
