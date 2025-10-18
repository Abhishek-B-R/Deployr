import * as React from "react";
import { cn } from "@/lib/utils";

export interface PixelIconProps extends React.SVGAttributes<SVGSVGElement> {
  name: "star" | "heart" | "coin" | "block" | "sparkle";
  size?: number;
}

const PixelIcon = React.forwardRef<SVGSVGElement, PixelIconProps>(
  ({ name, size = 24, className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        className={cn("inline-block", className)}
        style={{ imageRendering: "pixelated" }}
        {...props}
      >
        <use href={`/pixel-sprites.svg#pixel-${name}`} />
      </svg>
    );
  }
);
PixelIcon.displayName = "PixelIcon";

export { PixelIcon };
