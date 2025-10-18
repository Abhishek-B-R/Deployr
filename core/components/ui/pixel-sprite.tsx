import * as React from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

export type PixelSpriteProps = Omit<ImageProps, "style" | "unoptimized"> & {
  scale?: number
}

/**
 * PixelSprite renders Next/Image with crisp edges and pixelated rendering.
 * Use small source sprites (e.g., 16x16 or 32x32) and upscale with `scale`.
 */
export function PixelSprite({
  className,
  scale = 1,
  width,
  height,
  alt,
  ...props
}: PixelSpriteProps) {
  const scaledWidth = typeof width === "number" ? Math.round(width * scale) : width
  const scaledHeight = typeof height === "number" ? Math.round(height * scale) : height

  return (
    <Image
      alt={alt}
      className={cn("pixelated", className)}
      width={scaledWidth as number}
      height={scaledHeight as number}
      unoptimized
      style={{ imageRendering: "pixelated" as any }}
      {...props}
    />
  )
}
