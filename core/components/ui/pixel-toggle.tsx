"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PixelToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
  disabled?: boolean
  id?: string
}

export function PixelToggle({ checked, onChange, label, className, disabled, id }: PixelToggleProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      if (!disabled) onChange(!checked)
    }
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        id={id}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex h-7 w-14 items-center border-[3px] px-1 transition-transform duration-150",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe17d]/50",
          "border-[#1b1036] bg-[#f8ecff] shadow-[3px_3px_0_0_rgba(27,16,54,0.45)] dark:border-[#8f79ff] dark:bg-[#1a1430]",
          checked
            ? "translate-x-[-2px] translate-y-[-2px] shadow-[5px_5px_0_0_rgba(27,16,54,0.45)]"
            : "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_rgba(27,16,54,0.45)]"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "block h-4 w-4 border-[2px]",
            checked
              ? "translate-x-7 border-[#1b1036] bg-[#8fff65]"
              : "translate-x-0 border-[#1b1036] bg-[#ff6584]"
          )}
          style={{ imageRendering: "pixelated" }}
        />
      </button>
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.32em] text-[#1b1036] dark:text-[#f6ecff]">
        {label}
      </label>
    </div>
  )
}
