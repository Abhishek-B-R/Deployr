"use client"

import { useRef } from "react"
import { motion, type Variants, useInView } from "framer-motion"
import { Github, GitBranch, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"

import { PixelButton, PixelPanel, PixelProgress, PixelTag, RetroBadge, PixelCard } from "@/components/ui/pixel-primitives"
import AchievementList from "@/components/Landing/AchievementList"

const trackVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.18,
    },
  },
}

const steps = [
  {
    icon: Github,
    title: "Connect Repository",
    description: "Link your GitHub, GitLab, or Bitbucket repository containing your frontend project.",
    reward: "Source synced",
  },
  {
    icon: GitBranch,
    title: "Auto-Configure Build",
    description: "We detect your framework (React, Vue, Angular, etc.) and configure optimal build settings.",
    reward: "Build tuned",
  },
  {
    icon: Rocket,
    title: "Deploy & Share",
    description: "Your frontend goes live instantly with a custom URL ready to share with clients and users.",
    reward: "Launch boosted",
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const router = useRouter()
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="how-it-works" className="relative overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(34,22,63,0.05)_1px,transparent_1px),linear-gradient(rgba(34,22,63,0.05)_1px,transparent_1px)] bg-[size:24px_24px] opacity-65"
      />
      <div className="absolute -left-24 bottom-10 h-48 w-48 border-[3px] border-[#1b1036] bg-[#ffe17d]/25 shadow-[6px_6px_0_0_rgba(27,16,54,0.2)]" />
      <div className="container relative z-10 space-y-12 py-20">
        <motion.div
          className="mx-auto max-w-3xl space-y-4 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <RetroBadge tone="info" className="mx-auto px-4 py-[4px] text-[9px] tracking-[0.32em]">
            Campaign Path · Three Steps
          </RetroBadge>
          <h2 className="text-3xl font-black uppercase leading-tight tracking-[0.2em] text-[#1b1036] dark:text-[#f6ecff] md:text-4xl">
            Deploy in three simple quests
          </h2>
          <p className="text-sm uppercase tracking-[0.28em] text-[#332756] dark:text-[#d4cfff] md:text-base">
            Get your frontend project live in minutes with our streamlined, pixel-perfect deployment process.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <motion.div
            className="space-y-4"
            variants={trackVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {steps.map((step, index) => (
              <motion.div key={step.title} variants={trackVariants}>
                <PixelCard tone="ghost" padding="sm" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <PixelPanel
                      tone="accent"
                      padding="xs"
                      pattern={false}
                      className="flex h-14 w-14 items-center justify-center"
                    >
                      <step.icon className="h-7 w-7 text-[#23173f]" />
                    </PixelPanel>
                    <div className="space-y-2">
                      <RetroBadge tone="neutral" className="inline-flex px-2 py-[2px] text-[9px] tracking-[0.3em]">
                        Step 0{index + 1}
                      </RetroBadge>
                      <h3 className="text-xl font-black uppercase tracking-[0.2em] text-[#1b1036] dark:text-[#f6ecff]">
                        {step.title}
                      </h3>
                      <p className="max-w-xl text-sm uppercase tracking-[0.26em] text-[#332756] dark:text-[#d4cfff]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <RetroBadge tone="success" size="xs">
                    {step.reward}
                  </RetroBadge>
                </PixelCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <PixelPanel tone="terminal" padding="lg" pattern={false} className="space-y-6">
              <div className="space-y-2 text-left">
                <PixelTag tone="midnight" className="bg-[#0f2d2d] px-3 py-[4px] text-[9px] tracking-[0.28em] text-[#91f6d3]">
                  Progress tracker
                </PixelTag>
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-[#91f6d3]">
                  Your deployment build-up
                </h3>
                <p className="text-sm uppercase tracking-[0.26em] text-[#63dfbe]">
                  Each quest increases your launch multiplier and unlocks new power-ups.
                </p>
              </div>
              <PixelProgress value={99} label="Quest completion" />
              <AchievementList
                items={[
                  { label: "Repository connected", status: "complete" },
                  { label: "Build auto-configured", status: "optimized" },
                  { label: "Shareable preview", status: "live" },
                  { label: "Production launch", status: "awaiting" },
                ]}
              />
              <PixelButton
                variant="secondary"
                size="lg"
                type="button"
                className="normal-case tracking-[0.2em]"
                onClick={() => router.push("/new")}
              >
                Start quest now
              </PixelButton>
            </PixelPanel>
          </motion.div>
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="mb-4 text-sm uppercase tracking-[0.28em] text-[#332756] dark:text-[#d4cfff]">
            Ready to deploy your first project?
          </p>
          <PixelButton
            variant="primary"
            size="lg"
            type="button"
            className="normal-case tracking-[0.2em]"
            onClick={() => router.push("/new")}
          >
            Start deploying now
          </PixelButton>
        </motion.div>
      </div>
    </section>
  )
}
