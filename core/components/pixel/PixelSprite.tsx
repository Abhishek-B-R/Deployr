"use client"

import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

export type PixelSpriteProps = Omit<ImageProps, "unoptimized"> & {
  crisp?: boolean
}

export default function PixelSprite({ className, style, crisp = true, ...props }: PixelSpriteProps) {
  return (
    <Image
      {...props}
      className={cn(className)}
      style={{
        imageRendering: crisp ? ("pixelated" as any) : undefined,
        ...style,
      }}
      priority={props.priority}
    />
  )
}
