import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pixelPanelVariants = cva(
  "relative overflow-hidden rounded-none border-[3px] border-[#1f163b] bg-[#f8edff] text-[#1b1236] shadow-[4px_4px_0_0_rgba(24,18,58,0.75)] transition-transform duration-200 dark:border-[#8575ff] dark:bg-[#130c25] dark:text-[#f7edff] dark:shadow-[4px_4px_0_0_rgba(115,99,255,0.35)]",
  {
    variants: {
      tone: {
        default: "",
        midnight:
          "bg-[#10061f] text-[#f3e9ff] border-[#0a0314] shadow-[4px_4px_0_0_rgba(10,3,20,0.85)] dark:border-[#6d52ff]/70",
        accent: "bg-[#ffe57f] text-[#23173f] border-[#23173f] shadow-[4px_4px_0_0_rgba(35,23,63,0.7)]",
        terminal: "bg-[#082626] text-[#91f6d3] border-[#91f6d3] shadow-[4px_4px_0_0_rgba(8,38,38,0.85)]",
        ghost: "bg-[#fffdf5] text-[#221538] border-[#221538]/80 shadow-[4px_4px_0_0_rgba(34,21,56,0.25)] dark:bg-[#1f1633] dark:text-[#f6ecff]",
      },
      padding: {
        none: "p-0",
        xs: "p-3",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      tone: "default",
      padding: "md",
    },
  }
)

export interface PixelPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pixelPanelVariants> {
  pattern?: boolean
}

export function PixelPanel({
  className,
  children,
  tone,
  padding,
  pattern = true,
  ...props
}: PixelPanelProps) {
  const patternColor =
    tone === "midnight"
      ? "rgba(255, 225, 125, 0.15)"
      : tone === "terminal"
        ? "rgba(145, 246, 211, 0.22)"
        : tone === "accent"
          ? "rgba(35, 23, 63, 0.2)"
          : "rgba(34, 22, 63, 0.14)"

  const patternOpacity = tone === "midnight" ? 0.35 : tone === "terminal" ? 0.3 : 0.45

  return (
    <div className={cn(pixelPanelVariants({ tone, padding }), className)} {...props}>
      {pattern ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(90deg, ${patternColor} 1px, transparent 1px), linear-gradient(${patternColor} 1px, transparent 1px)`,
            backgroundSize: "12px 12px",
            opacity: patternOpacity,
          }}
        />
      ) : null}
      <span aria-hidden className="absolute inset-1 border border-black/15 pointer-events-none z-0 dark:border-white/15" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

const pixelButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap border-[3px] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.32em] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe17d]/50 active:translate-x-0 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[#ff6584] text-[#1b1036] border-[#1b1036] shadow-[4px_4px_0_0_rgba(27,17,54,0.8)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_rgba(27,17,54,0.8)]",
        secondary:
          "bg-[#8fff65] text-[#13241f] border-[#13241f] shadow-[4px_4px_0_0_rgba(19,36,31,0.75)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_rgba(19,36,31,0.75)]",
        ghost:
          "bg-[#f8ecff] text-[#1c1441] border-[#1c1441] shadow-[4px_4px_0_0_rgba(28,20,65,0.45)] hover:bg-[#ffe17d] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_rgba(28,20,65,0.45)] dark:bg-[#211a34] dark:text-[#f6ecff]",
        icon:
          "bg-[#1f1633] text-[#f6ecff] border-[#f6ecff] shadow-[4px_4px_0_0_rgba(246,236,255,0.35)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_rgba(246,236,255,0.35)]",
      },
      size: {
        sm: "h-9 px-4 text-[10px]",
        default: "h-12 px-6 text-xs md:text-sm",
        lg: "h-14 px-10 text-sm md:text-base",
        square: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface PixelButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof pixelButtonVariants> {
  asChild?: boolean
}

export function PixelButton({ className, variant, size, asChild = false, ...props }: PixelButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="pixel-button"
      className={cn(pixelButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const pixelTagVariants = cva(
  "inline-flex items-center gap-2 border-[2px] border-[#22163f] bg-[#ffe17d] px-3 py-1 text-[10px] font-black uppercase tracking-[0.4em] text-[#22163f] shadow-[2px_2px_0_0_rgba(34,22,63,0.6)]",
  {
    variants: {
      tone: {
        default: "",
        info: "bg-[#98c8ff] text-[#15264c] border-[#15264c] shadow-[2px_2px_0_0_rgba(21,38,76,0.45)]",
        warning: "bg-[#ff9a62] text-[#1a0922] border-[#1a0922] shadow-[2px_2px_0_0_rgba(26,9,34,0.5)]",
        success: "bg-[#7bff9f] text-[#082822] border-[#082822] shadow-[2px_2px_0_0_rgba(8,40,34,0.45)]",
        neutral: "bg-[#f6ecff] text-[#23173f] border-[#23173f] shadow-[2px_2px_0_0_rgba(35,23,63,0.3)]",
        midnight: "bg-[#130826] text-[#f1e9ff] border-[#f1e9ff] shadow-[2px_2px_0_0_rgba(241,233,255,0.3)]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
)

export interface PixelTagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof pixelTagVariants> {
  icon?: React.ReactNode
}

export function PixelTag({ className, tone, icon, children, ...props }: PixelTagProps) {
  return (
    <span className={cn(pixelTagVariants({ tone }), className)} {...props}>
      {icon ? <span className="flex items-center justify-center" aria-hidden>{icon}</span> : null}
      <span className="leading-none">{children}</span>
    </span>
  )
}

export interface PixelProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  label?: string
}

export function PixelProgress({ value, label, className, ...props }: PixelProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label ? (
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.35em] text-[#21153f] dark:text-[#f6ecff]">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        className="relative h-5 border-[3px] border-[#21153f] bg-[#f8ecff] dark:border-[#8f79ff] dark:bg-[#1a1430]"
      >
        <span className="absolute inset-[2px] border border-black/10 dark:border-white/10 pointer-events-none" aria-hidden />
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${safeValue}%`,
            backgroundColor: "#8fff65",
            backgroundImage:
              "linear-gradient(90deg, rgba(19,18,44,0.25) 0px, rgba(19,18,44,0.25) 2px, transparent 2px)",
            backgroundSize: "8px 100%",
          }}
        />
      </div>
    </div>
  )
}

export { pixelButtonVariants, pixelTagVariants, pixelPanelVariants }
