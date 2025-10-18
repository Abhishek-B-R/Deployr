"use client"

import { useEffect, useMemo, useRef } from "react"
import { motion, type Variants, useReducedMotion } from "framer-motion"
import { ArrowRight, Play, TriangleAlert } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Stars } from "@react-three/drei"
import type { Group } from "three"
import { useRouter } from "next/navigation"

import { PixelButton, PixelPanel, PixelProgress, PixelTag } from "@/components/ui/pixel-primitives"

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

export default function Hero({ isVisible }: HeroProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "s" || e.key === "S") && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        router.push("/new")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [router])

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
          variants={reduceMotion ? undefined : containerVariants}
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : isVisible ? "visible" : "hidden"}
        >
          <motion.div variants={reduceMotion ? undefined : itemVariants} className="flex flex-wrap items-center gap-3">
            <PixelTag
              tone="warning"
              className="px-3 py-[4px] text-[9px] tracking-[0.32em]"
              icon={<TriangleAlert className="h-3 w-3" />}
            >
              Backend is down right now, please check back later
            </PixelTag>
          </motion.div>

          <motion.div variants={reduceMotion ? undefined : itemVariants} className="space-y-4">
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
            variants={reduceMotion ? undefined : itemVariants}
            className="max-w-2xl text-sm uppercase tracking-[0.28em] text-[#332756] dark:text-[#d4cfff] md:text-base"
          >
            Streamline your frontend deployment process with zero configuration. From repository to live site in seconds,
            now wrapped in an 8-bit adventure.
          </motion.p>

          <motion.div variants={reduceMotion ? undefined : itemVariants} className="flex flex-col gap-4 sm:flex-row">
            <PixelButton
              variant="primary"
              size="lg"
              type="button"
              onClick={() => router.push("/new")}
              className="w-full sm:w-auto"
              accessKey="s"
              aria-label="Start quest (shortcut: S)"
            >
              Start quest
              <ArrowRight className="h-4 w-4" />
            </PixelButton>
            <PixelButton
              variant="ghost"
              size="lg"
              type="button"
              onClick={() => router.push("/demo.mp4")}
              className="w-full sm:w-auto"
              aria-label="Watch demo"
            >
              <Play className="h-4 w-4" />
              Watch demo
            </PixelButton>
          </motion.div>

          <motion.div variants={reduceMotion ? undefined : itemVariants} className="grid gap-4 md:grid-cols-2">
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
                <span className="text-[10px] font-black uppercase tracking-[0.32em] text-[#91f6d3]">
                  Run · 01
                </span>
              </div>
              <PixelProgress value={96} label="Deployment readiness" />
              <div className="space-y-1 text-[9px] font-black uppercase tracking-[0.28em] text-[#0f2d2d]">
                <p>⚡ Instant preview links unlocked</p>
                <p>🛡️ SSL shield equipped</p>
              </div>
            </PixelPanel>
          </motion.div>
        </motion.div>

        <motion.div variants={reduceMotion ? undefined : itemVariants} className="relative">
          <PixelPanel tone="midnight" padding="none" pattern={false} className="relative h-[320px] overflow-hidden md:h-[400px] lg:h-[460px]">
            <div className="absolute inset-0">
              <Canvas
                gl={{ antialias: false }}
                camera={{ position: [4, 3.5, 6], fov: 40 }}
                style={{ width: "100%", height: "100%", imageRendering: "pixelated" }}
              >
                <color attach="background" args={["#10061f"]} />
                <ambientLight intensity={0.6} />
                <directionalLight position={[4, 6, 5]} intensity={1.1} color="#ffe17d" />
                <Stars radius={45} depth={22} count={280} factor={4} saturation={0} fade speed={!!reduceMotion ? 0 : 0.4} />
                <PixelLandscape reduceMotion={!!reduceMotion} />
              </Canvas>
            </div>

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
          </PixelPanel>
        </motion.div>
      </div>
    </section>
  )
}

type LandscapeBlock = {
  position: [number, number, number]
  scale: [number, number, number]
  color: string
}

function PixelLandscape({ reduceMotion = false }: { reduceMotion?: boolean }) {
  const group = useRef<Group | null>(null)

  const blocks = useMemo<LandscapeBlock[]>(
    () => [
      { position: [-1.6, -0.15, -1.2], scale: [1.3, 0.6, 1.3], color: "#ff6584" },
      { position: [1.4, -0.05, -1.4], scale: [1.1, 0.5, 1.1], color: "#8fff65" },
      { position: [-0.4, 0.3, 1.8], scale: [0.8, 1.2, 0.8], color: "#98c8ff" },
      { position: [-1.9, 0.25, 1], scale: [0.6, 1.4, 0.6], color: "#ffe17d" },
      { position: [0.9, 0.15, 0.6], scale: [0.9, 0.9, 0.9], color: "#ff9a62" },
    ],
    []
  )

  useFrame((_, delta) => {
    if (group.current && !reduceMotion) {
      group.current.rotation.y += delta * 0.18
    }
  })

  return (
    <group ref={group} position={[0, -0.3, 0]} rotation={[0.3, 0.4, 0]}>
      <mesh position={[0, -0.9, 0]} scale={[4.8, 0.3, 4.8]} receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color="#201537" />
      </mesh>
      {blocks.map((block, index) => (
        <mesh key={index} position={block.position} scale={block.scale} castShadow receiveShadow>
          <boxGeometry />
          <meshStandardMaterial color={block.color} />
        </mesh>
      ))}
      <Float speed={reduceMotion ? 0 : 1.4} rotationIntensity={reduceMotion ? 0 : 0.3} floatIntensity={reduceMotion ? 0 : 0.7}>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial color="#ffe17d" emissive="#ff9a62" emissiveIntensity={0.45} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[2.2, 0.18, 2.2]} />
          <meshStandardMaterial color="#2d1f49" />
        </mesh>
      </Float>
      <mesh position={[1.9, 0.1, 1.6]} scale={[0.3, 1.4, 0.3]}>
        <boxGeometry />
        <meshStandardMaterial color="#8fff65" />
      </mesh>
      <mesh position={[1.9, 1.2, 1.6]} scale={[0.5, 0.3, 0.5]}>
        <boxGeometry />
        <meshStandardMaterial color="#59f6bc" />
      </mesh>
    </group>
  )
}
