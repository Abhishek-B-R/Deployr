"use client"

import { motion } from "framer-motion"
import { PixelCard, RetroBadge, PixelProgress, PixelPanel } from "@/components/ui/pixel-primitives"

export type QuestCardProps = {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  xp: string
  progress: number
  reward: string
  className?: string
}

export default function QuestCard({ id, icon: Icon, title, description, xp, progress, reward, className }: QuestCardProps) {
  return (
    <PixelCard tone="ghost" padding="sm" className={`flex h-full flex-col gap-4 ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <RetroBadge tone="neutral" size="xs">
          {id}
        </RetroBadge>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1b1036] dark:text-[#f6ecff]">
          {xp}
        </span>
      </div>
      <motion.div
        className="flex h-12 w-12 items-center justify-center"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <PixelPanel tone="accent" padding="xs" pattern={false} className="flex h-12 w-12 items-center justify-center">
          <Icon className="h-6 w-6 text-[#23173f]" />
        </PixelPanel>
      </motion.div>
      <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[#1b1036] dark:text-[#f6ecff]">{title}</h3>
      <p className="flex-1 text-sm uppercase tracking-[0.26em] text-[#332756] dark:text-[#d4cfff]">{description}</p>
      <PixelProgress value={progress} label="Completion" />
      <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#1b1036] dark:text-[#f6ecff]">
        Reward · {reward}
      </span>
    </PixelCard>
  )
}
