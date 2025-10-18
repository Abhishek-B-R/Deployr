"use client"

import { useEffect, useRef, useState } from "react"
import { motion, type Variants, useReducedMotion } from "framer-motion"
import { ArrowRight, Play, TriangleAlert, MonitorCog, Volume2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { PixelButton, PixelPanel, PixelProgress, PixelTag } from "@/components/ui/pixel-primitives"
import { PixelToggle } from "@/components/ui/pixel-toggle"
import PixelSprite from "@/components/pixel/PixelSprite"
import { usePixelPreferences } from "@/hooks/usePixelPreferences"

interface HeroProps {
  isVisible: boolean
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Lazy-load heavy R3F scene to keep LCP budget tight
const DynamicCanvasScene = dynamic(() => import("./CanvasScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
})

export default function Hero({ isVisible }: HeroProps) {
  const router = useRouter()
  const { prefs, toggleCRT, toggleSFX, hydrated } = usePixelPreferences()
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()

  const show3D = hydrated && !reducedMotion && !isMobile

  // SFX manager with graceful fallback
  const audioRefs = useRef<{ hover?: HTMLAudioElement; click?: HTMLAudioElement }>({})
  const [audioReady, setAudioReady] = useState(false)

  useEffect(() => {
    if (!prefs.sfx || reducedMotion) return
    // Attempt to load audio assets from public/audio, fall back to WebAudio bleeps
    const hover = new Audio("/audio/ui-hover.mp3")
    const click = new Audio("/audio/ui-click.mp3")
    audioRefs.current.hover = hover
    audioRefs.current.click = click
    const onCanPlay = () => setAudioReady(true)
    const onError = () => setAudioReady(false)
    hover.addEventListener("canplaythrough", onCanPlay)
    click.addEventListener("canplaythrough", onCanPlay)
    hover.addEventListener("error", onError)
    click.addEventListener("error", onError)
    return () => {
      hover.pause()
      click.pause()
      hover.removeEventListener("canplaythrough", onCanPlay)
      click.removeEventListener("canplaythrough", onCanPlay)
      hover.removeEventListener("error", onError)
      click.removeEventListener("error", onError)
    }
  }, [prefs.sfx, reducedMotion])

  const playBeep = (freq = 880, duration = 0.06) => {
    if (typeof window === "undefined") return
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = "square"
      o.frequency.value = freq
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.setValueAtTime(0.08, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      o.start()
      o.stop(ctx.currentTime + duration)
    } catch (_) {}
  }

  const playHover = () => {
    if (!prefs.sfx || reducedMotion) return
    if (audioReady && audioRefs.current.hover) {
      audioRefs.current.hover.currentTime = 0
      audioRefs.current.hover.play().catch(() => playBeep(660))
    } else {
      playBeep(660)
    }
  }
  const playClick = () => {
    if (!prefs.sfx || reducedMotion) return
    if (audioReady && audioRefs.current.click) {
      audioRefs.current.click.currentTime = 0
      audioRefs.current.click.play().catch(() => playBeep(220))
    } else {
      playBeep(220)
    }
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute -left-16 top-10 hidden h-24 w-24 border-[3px] border-[#1b1036] bg-[#ffe17d]/40 shadow-[6px_6px_0_0_rgba(27,16,54,0.35)] lg:block" />
      <div className="absolute -right-24 bottom-0 h-52 w-52 border-[3px] border-[#1b1036]/40 bg-[#8fff65]/20 shadow-[6px_6px_0_0_rgba(27,16,54,0.2)] blur-sm" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(34,22,63,0.06)_1px,transparent_1px),linear-gradient(rgba(34,22,63,0.06)_1px,transparent_1px)] bg-[size:20px_20px] opacity-70"
      />

      <div className="container relative z-10 grid gap-12 py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
            <PixelTag
              tone="warning"
              className="px-3 py-[4px] text-[9px] tracking-[0.32em]"
              icon={<TriangleAlert className="h-3 w-3" />}
            >
              Backend is down right now, please check back later
            </PixelTag>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <PixelTag tone="info" className="px-3 py-[4px] text-[9px] tracking-[0.32em]">
              Quest 01 · Launch Sequence
            </PixelTag>
            <motion.h1 className="text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              <span className="block text-[#1b1036] dark:text-[#f6ecff]">Deploy your frontend</span>
              <span className="mt-2 block text-3xl text-[#ff6584] drop-shadow-[2px_2px_0_rgba(27,16,54,0.35)] md:text-5xl">
                faster than a speedrun
              </span>
            </motion.h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-sm uppercase tracking-[0.28em] text-[#332756] dark:text-[#d4cfff] md:text-base"
          >
            Streamline your frontend deployment process with zero configuration. From repository to live site in seconds,
            now wrapped in an 8-bit adventure.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row">
            <PixelButton asChild variant="primary" size="lg" type="button" className="w-full sm:w-auto">
              <motion.button
                onHoverStart={playHover}
                onClick={() => {
                  playClick()
                  router.push("/new")
                }}
                whileHover={{ x: -8, y: -8 }}
                whileFocus={{ x: -8, y: -8 }}
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
              >
                Start quest
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </PixelButton>
            <PixelButton asChild variant="ghost" size="lg" type="button" className="w-full sm:w-auto">
              <motion.button
                onHoverStart={playHover}
                onClick={() => {
                  playClick()
                  router.push("/demo.mp4")
                }}
                whileHover={{ x: -8, y: -8 }}
                whileFocus={{ x: -8, y: -8 }}
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
              >
                <Play className="h-4 w-4" />
                Watch demo
              </motion.button>
            </PixelButton>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
            <PixelPanel tone="ghost" padding="sm" className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 bg-[#7bff9f] shadow-[2px_2px_0_0_rgba(34,22,63,0.4)]" aria-hidden />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1b1036] dark:text-[#f6ecff]">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 bg-[#ff9a62] shadow-[2px_2px_0_0_rgba(34,22,63,0.4)]" aria-hidden />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1b1036] dark:text-[#f6ecff]">
                  Free tier available
                </span>
              </div>
              <PixelTag tone="neutral" className="px-2 py-[2px] text-[9px] tracking-[0.28em]">
                Gamified control panel ready
              </PixelTag>
            </PixelPanel>

            <PixelPanel tone="terminal" padding="sm" pattern={false} className="flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <PixelTag tone="midnight" className="bg-[#0f2d2d] px-2 py-[2px] text-[9px] tracking-[0.3em] text-[#91f6d3]">
                  Quest stats
                </PixelTag>
                <span className="text-[10px] font-black uppercase tracking-[0.32em] text-[#91f6d3]">Run · 01</span>
              </div>
              <PixelProgress value={96} label="Deployment readiness" />
              <div className="space-y-1 text-[9px] font-black uppercase tracking-[0.28em] text-[#0f2d2d]">
                <p>⚡ Instant preview links unlocked</p>
                <p>🛡️ SSL shield equipped</p>
              </div>
            </PixelPanel>
          </motion.div>
        </motion.div>

        {/* Right column: HUD + Scene */}
        <motion.div variants={itemVariants} className="relative">
          <PixelPanel tone="midnight" padding="none" pattern={false} className="relative h-[320px] overflow-hidden md:h-[400px] lg:h-[460px]">
            {/* Canvas or static fallback */}
            {show3D ? (
              <DynamicCanvasScene />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <PixelSprite src="/pixel/hero-fallback.svg" alt="Pixel scene illustration" width={800} height={450} crisp priority />
              </div>
            )}

            {/* Sprite overlays (decorative) */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <PixelSprite src="/pixel/sparkle.svg" alt="" width={16} height={16} className="absolute left-3 top-3" />
              <PixelSprite src="/pixel/sparkle.svg" alt="" width={16} height={16} className="absolute right-5 bottom-4" />
            </div>

            {/* HUD labels */}
            <div className="absolute left-4 top-4">
              <PixelTag tone="midnight" className="bg-[#201040] px-2 py-[3px] text-[9px] tracking-[0.28em] text-[#ffe17d]">
                Scene · Deploy Valley
              </PixelTag>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <PixelPanel tone="ghost" padding="xs" className="flex items-center justify-between" pattern>
                <span className="text-[9px] font-black uppercase tracking-[0.28em] text-[#1b1036] dark:text-[#f6ecff]">
                  Gamified CTAs online
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.28em] text-[#1b1036] dark:text-[#f6ecff]">
                  fps · 60
                </span>
              </PixelPanel>
            </div>

            {/* CRT overlay toggleable */}
            {prefs.crt && !reducedMotion ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-lighten opacity-40"
                animate={{ opacity: [0.35, 0.5, 0.35] }}
                transition={{ duration: 6, repeat: Infinity }}
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px), radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.2) 100%)",
                }}
              />
            ) : null}
          </PixelPanel>

          {/* Preferences HUD */}
          <div className="absolute right-0 top-0 z-20 m-4">
            <PixelPanel tone="ghost" padding="xs" className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MonitorCog className="h-4 w-4" aria-hidden />
                <span className="text-[9px] font-black uppercase tracking-[0.28em]">FX</span>
              </div>
              <PixelToggle checked={!!prefs.crt} onChange={toggleCRT} label="CRT" />
              <div className="h-5 w-[1px] bg-black/20 dark:bg-white/20" aria-hidden />
              <Volume2 className="h-4 w-4" aria-hidden />
              <PixelToggle checked={!!prefs.sfx} onChange={toggleSFX} label="SFX" />
            </PixelPanel>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)")
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener ? mql.addEventListener("change", onChange) : mql.addListener(onChange)
    return () => {
      mql.removeEventListener ? mql.removeEventListener("change", onChange) : mql.removeListener(onChange)
    }
  }, [])
  return isMobile
}
