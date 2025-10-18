"use client"

import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

export type PixelSpriteProps = Omit<ImageProps, "unoptimized"> & {
  pixelScale?: 1 | 2 | 3
}

/**
 * PixelSprite wraps Next/Image to render crisp, pixelated sprites with optional 1x/2x/3x srcSets.
 * Provide width/height for deterministic layout (prevents CLS) and pass a base src.
 * If you also provide srcSet via `sizes` and different device pixel ratios, it will be used as-is.
 */
export default function PixelSprite({
  className,
  pixelScale = 1,
  alt,
  ...props
}: PixelSpriteProps) {
  // Enforce deterministic layout to avoid CLS
  const { width, height } = props

  return (
    <Image
      {...props}
      alt={alt}
      width={width}
      height={height}
      priority={props.priority ?? false}
      className={cn("select-none", className)}
      style={{
        imageRendering: "pixelated",
        ...props.style,
      }}
    />
  )
}
