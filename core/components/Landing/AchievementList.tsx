"use client"

import { RetroBadge } from "@/components/ui/pixel-primitives"

export type Achievement = {
  label: string
  status: "complete" | "optimized" | "live" | "awaiting"
}

export default function AchievementList({ items }: { items: Achievement[] }) {
  const toneFor = (status: Achievement["status"]) => {
    switch (status) {
      case "complete":
      case "optimized":
      case "live":
        return "success" as const
      case "awaiting":
      default:
        return "neutral" as const
    }
  }

  const textFor = (status: Achievement["status"]) => {
    switch (status) {
      case "complete":
        return "Complete"
      case "optimized":
        return "Optimized"
      case "live":
        return "Live"
      case "awaiting":
      default:
        return "Awaiting"
    }
  }

  return (
    <div className="space-y-3 text-[10px] uppercase tracking-[0.28em]">
      {items.map((it) => (
        <div key={it.label} className="flex items-center justify-between">
          <span className="text-[#332756] dark:text-[#d4cfff]">{it.label}</span>
          <RetroBadge tone={toneFor(it.status)} size="xs">
            {textFor(it.status)}
          </RetroBadge>
        </div>
      ))}
    </div>
  )
}
