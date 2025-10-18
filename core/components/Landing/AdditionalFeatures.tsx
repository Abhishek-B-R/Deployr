"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { Globe, Settings, Shield } from "lucide-react"

import { PixelButton, PixelPanel, PixelProgress, PixelTag } from "@/components/ui/pixel-primitives"

const powerUps = [
  {
    icon: Shield,
    title: "SSL & Security",
    description: "Automatic SSL certificates and secure HTTPS for all your deployments.",
    badge: "Shield equipped",
  },
  {
    icon: Globe,
    title: "Global Edge Network",
    description: "Lightning-fast content delivery through our worldwide CDN infrastructure.",
    badge: "Reach amplified",
  },
  {
    icon: Settings,
    title: "Environment Variables",
    description: "Secure configuration management with encrypted environment variables.",
    badge: "Control console",
  },
]

const gauges = [
  { label: "Security rating", value: 100 },
  { label: "Global reach", value: 96 },
  { label: "Config control", value: 93 },
]

export default function AdditionalFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const reduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(34,22,63,0.05)_1px,transparent_1px),linear-gradient(rgba(34,22,63,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-60"
      />
      <div className="absolute right-[-80px] top-8 h-52 w-52 border-[3px] border-[#1b1036] bg-[#8fff65]/25 shadow-[6px_6px_0_0_rgba(27,16,54,0.2)]" />

      <div className="container relative z-10 space-y-12 py-20">
        <motion.div
          className="max-w-3xl space-y-4"
          initial={reduceMotion ? undefined : { opacity: 0, y: 40 }}
          animate={reduceMotion ? undefined : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <PixelTag tone="info" className="px-4 py-[4px] text-[9px] tracking-[0.32em]">
            Power-Ups · Optional Buffs
          </PixelTag>
          <h2 className="text-3xl font-black uppercase leading-tight tracking-[0.2em] text-[#1b1036] dark:text-[#f6ecff] md:text-4xl">
            Equip extra power-ups for the long run
          </h2>
          <p className="text-sm uppercase tracking-[0.28em] text-[#332756] dark:text-[#d4cfff] md:text-base">
            These enhancements keep your deployment stable, fast, and adaptable no matter how many players join the game.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <motion.div
            className="space-y-6"
            initial={reduceMotion ? undefined : { opacity: 0, x: -40 }}
            animate={reduceMotion ? undefined : isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <PixelPanel tone="ghost" padding="lg" className="space-y-6">
              <PixelTag tone="neutral" className="inline-flex px-3 py-[4px] text-[9px] tracking-[0.3em]">
                Loadout inventory
              </PixelTag>
              <div className="grid gap-4 md:grid-cols-2">
                {powerUps.map((item) => (
                  <PixelPanel key={item.title} tone="ghost" padding="sm" className="flex flex-col gap-3 border-[3px] border-[#23173f]/40">
                    <div className="flex items-start gap-3">
                      <PixelPanel tone="accent" padding="xs" pattern={false} className="flex h-12 w-12 items-center justify-center">
                        <item.icon className="h-6 w-6 text-[#23173f]" />
                      </PixelPanel>
                      <div className="space-y-2">
                        <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[#1b1036] dark:text-[#f6ecff]">
                          {item.title}
                        </h3>
                        <p className="text-sm uppercase tracking-[0.26em] text-[#332756] dark:text-[#d4cfff]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <PixelTag tone="success" className="px-2 py-[2px] text-[9px] tracking-[0.28em]">
                      {item.badge}
                    </PixelTag>
                  </PixelPanel>
                ))}
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm uppercase tracking-[0.26em] text-[#332756] dark:text-[#d4cfff]">
                  Configure, monitor, and secure every deployment from one retro-inspired console.
                </div>
                <PixelButton
                  variant="ghost"
                  size="lg"
                  className="normal-case tracking-[0.2em]"
                  type="button"
                  onClick={() => {
                    window.open("https://www.github.com/Abhishek-B-R/Deployr", "_blank", "noopener,noreferrer")
                  }}
                  aria-label="View full spec sheet"
                >
                  View full spec sheet
                </PixelButton>
              </div>
            </PixelPanel>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={reduceMotion ? undefined : { opacity: 0, x: 40 }}
            animate={reduceMotion ? undefined : isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          >
            <PixelPanel tone="midnight" padding="lg" pattern={false} className="space-y-6 text-[#f6ecff]">
              <div className="space-y-2">
                <PixelTag tone="midnight" className="bg-[#291f4a] px-3 py-[4px] text-[9px] tracking-[0.28em] text-[#ffe17d]">
                  Command center
                </PixelTag>
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-[#ffe17d]">
                  Real-time status feed
                </h3>
                <p className="text-sm uppercase tracking-[0.26em] text-[#cbb9ff]">
                  Monitor every boost from one dashboard—security, reach, and configuration.
                </p>
              </div>
              <div className="space-y-4">
                {gauges.map((gauge) => (
                  <PixelProgress key={gauge.label} value={gauge.value} label={gauge.label} />
                ))}
              </div>
              <div className="space-y-2 text-[10px] uppercase tracking-[0.28em] text-[#ffe17d]">
                <p>🛰️ Edge nodes synced worldwide</p>
                <p>🔐 Certificates refresh nightly</p>
                <p>🧪 Secrets encrypted at rest</p>
              </div>
            </PixelPanel>

            <PixelPanel tone="terminal" padding="lg" pattern={false} className="space-y-4">
              <div className="flex items-center justify-between">
                <PixelTag tone="midnight" className="bg-[#0f2d2d] px-3 py-[3px] text-[9px] tracking-[0.28em] text-[#91f6d3]">
                  Snapshot
                </PixelTag>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#91f6d3]">
                  Delta · +12%
                </span>
              </div>
              <div className="flex flex-col gap-3 text-[10px] uppercase tracking-[0.28em] text-[#63dfbe]">
                <div className="flex items-center justify-between">
                  <span>Latency</span>
                  <span>32ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active environments</span>
                  <span>08</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Secrets rotated</span>
                  <span>Auto</span>
                </div>
              </div>
            </PixelPanel>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
