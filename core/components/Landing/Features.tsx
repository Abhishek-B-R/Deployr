"use client"

import { useRef } from "react"
import { motion, type Variants, useInView } from "framer-motion"
import { Brain, Globe, Monitor, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

import { PixelButton, PixelPanel, PixelProgress, PixelTag } from "@/components/ui/pixel-primitives"

const quests = [
  {
    id: "Quest 02",
    icon: Zap,
    title: "One-Click Deploy",
    description: "From repository to live site in seconds. Zero configuration required for popular frameworks.",
    xp: "+320 XP",
    progress: 100,
    reward: "Instant launch unlocked",
  },
  {
    id: "Quest 03",
    icon: Globe,
    title: "Instant Preview Links",
    description: "Shareable preview URLs for every deployment and pull request. Perfect for client reviews.",
    xp: "+210 XP",
    progress: 92,
    reward: "Preview portals activated",
  },
  {
    id: "Quest 04",
    icon: Brain,
    title: "Smart Build Detection",
    description: "Automatically detects React, Vue, Angular, and other frameworks. Optimizes builds automatically.",
    xp: "+260 XP",
    progress: 95,
    reward: "Auto-config perks equipped",
  },
  {
    id: "Quest 05",
    icon: Monitor,
    title: "Live Deployment Logs",
    description: "Real-time visibility into your deployment process with detailed build logs and error reporting.",
    xp: "+280 XP",
    progress: 98,
    reward: "Diagnostics visor synced",
  },
]

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.12,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export default function Features() {
  const ref = useRef(null)
  const router = useRouter()
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="features" className="relative overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(34,22,63,0.05)_1px,transparent_1px),linear-gradient(rgba(34,22,63,0.05)_1px,transparent_1px)] bg-[size:18px_18px] opacity-70"
      />
      <div className="absolute -right-24 top-16 h-40 w-40 border-[3px] border-[#1b1036] bg-[#98c8ff]/30 shadow-[6px_6px_0_0_rgba(27,16,54,0.25)]" />
      <div className="container relative z-10 space-y-12 py-20">
        <motion.div
          className="mx-auto max-w-3xl space-y-4 text-center"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={headerVariants}>
            <PixelTag tone="info" className="mx-auto px-4 py-[4px] text-[9px] tracking-[0.32em]">
              Quest Log · Feature Drops
            </PixelTag>
          </motion.div>
          <motion.h2
            variants={headerVariants}
            className="text-3xl font-black uppercase leading-tight tracking-[0.2em] text-[#1b1036] dark:text-[#f6ecff] md:text-4xl"
          >
            Complete the Deployr quest log with battle-tested power-ups
          </motion.h2>
          <motion.p
            variants={headerVariants}
            className="text-sm uppercase tracking-[0.28em] text-[#332756] dark:text-[#d4cfff] md:text-base"
          >
            Powerful features that make frontend deployment simple, fast, and reliable for builders who like their releases with a side of nostalgia.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={{ visible: { transition: { staggerChildren: 0.12 } }, hidden: {} }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {quests.map((quest) => (
            <motion.div key={quest.id} variants={cardVariants}>
              <PixelPanel tone="ghost" padding="sm" className="flex h-full flex-col gap-4">
                <div className="flex items-center justify-between">
                  <PixelTag tone="neutral" className="px-2 py-[2px] text-[9px] tracking-[0.28em]">
                    {quest.id}
                  </PixelTag>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1b1036] dark:text-[#f6ecff]">
                    {quest.xp}
                  </span>
                </div>
                <motion.div
                  className="flex h-12 w-12 items-center justify-center"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <PixelPanel
                    tone="accent"
                    padding="xs"
                    pattern={false}
                    className="flex h-12 w-12 items-center justify-center"
                  >
                    <quest.icon className="h-6 w-6 text-[#23173f]" />
                  </PixelPanel>
                </motion.div>
                <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[#1b1036] dark:text-[#f6ecff]">
                  {quest.title}
                </h3>
                <p className="flex-1 text-sm uppercase tracking-[0.26em] text-[#332756] dark:text-[#d4cfff]">
                  {quest.description}
                </p>
                <PixelProgress value={quest.progress} label="Completion" />
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#1b1036] dark:text-[#f6ecff]">
                  Reward · {quest.reward}
                </span>
              </PixelPanel>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <PixelPanel tone="terminal" padding="lg" pattern={false} className="space-y-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3 text-left md:max-w-lg">
                <PixelTag tone="midnight" className="bg-[#0f2d2d] px-3 py-[4px] text-[9px] tracking-[0.28em] text-[#91f6d3]">
                  Milestone reward
                </PixelTag>
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-[#91f6d3]">
                  Ready to experience the future of deployment?
                </h3>
                <p className="text-sm uppercase tracking-[0.26em] text-[#63dfbe]">
                  Lock in your next quest line and ship with confidence across every build.
                </p>
              </div>
              <div className="w-full md:w-72">
                <PixelProgress value={92} label="Campaign progress" />
              </div>
            </div>
            <div className="flex flex-col gap-3 text-[10px] uppercase tracking-[0.28em] text-[#63dfbe] md:flex-row md:items-center md:justify-between">
              <span>⚙️ Framework auto-detection calibrated</span>
              <span>🚀 Preview portals synced</span>
              <span>🛡️ Guard rails ready</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <PixelButton
                variant="secondary"
                size="lg"
                type="button"
                className="normal-case tracking-[0.2em]"
                onClick={() => router.push("/new")}
              >
                Launch next deployment
              </PixelButton>
              <PixelButton
                variant="ghost"
                size="lg"
                type="button"
                className="normal-case tracking-[0.2em]"
                onClick={() => router.push("/projects")}
              >
                Review quest log
              </PixelButton>
            </div>
          </PixelPanel>
        </motion.div>
      </div>
    </section>
  )
}
