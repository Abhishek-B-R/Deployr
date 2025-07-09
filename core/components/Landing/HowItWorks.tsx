"use client"

import { Github, GitBranch, Rocket, Sparkles, Star, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, useInView, Variants } from "framer-motion"
import { useRef } from "react"
import { useRouter } from "next/navigation"

export default function HowItWorks() {
  const ref = useRef(null)
  const router = useRouter()
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants:Variants = {
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const steps = [
    {
      icon: Github,
      number: 1,
      title: "Connect Repository",
      description: "Link your GitHub, GitLab, or Bitbucket repository containing your frontend project.",
      gradient: "from-blue-500 to-purple-600",
      glowColor: "blue",
    },
    {
      icon: GitBranch,
      number: 2,
      title: "Auto-Configure Build",
      description: "We detect your framework (React, Vue, Angular, etc.) and configure optimal build settings.",
      gradient: "from-green-500 to-blue-600",
      glowColor: "green",
    },
    {
      icon: Rocket,
      number: 3,
      title: "Deploy & Share",
      description: "Your frontend goes live instantly with a custom URL ready to share with clients and users.",
      gradient: "from-purple-500 to-pink-600",
      glowColor: "purple",
    },
  ]

  return (
    <section ref={ref} id="how-it-works" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 right-20 text-blue-500/10"
        animate={{
          y: [-15, 15, -15],
          x: [-10, 10, -10],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Zap className="w-20 h-20" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 text-purple-500/10"
        animate={{
          y: [10, -10, 10],
          rotate: [0, -90, -180, -270, -360],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Sparkles className="w-16 h-16" />
      </motion.div>

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-blue-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="mb-4 px-4 py-2 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1.5, ease: "linear" }}
              >
                <Star className="w-3 h-3 mr-1" />
              </motion.div>
              How it Works
            </Badge>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Deploy in{" "}
            <motion.span
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                background: "linear-gradient(90deg, #2563eb, #9333ea, #ec4899, #2563eb)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              three simple steps
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Get your frontend project live in minutes with our streamlined deployment process.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div key={index} className="text-center group" variants={itemVariants}>
              <motion.div
                className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative`}
                whileHover={{
                  scale: 1.15,
                  x: [-3, 3, -3, 3, 0],
                  y: [-3, 3, -3, 3, 0],
                }}
                transition={{ duration: 0.4 }}
              >
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300 ${
                    step.glowColor === "blue"
                      ? "bg-blue-400/30"
                      : step.glowColor === "green"
                        ? "bg-green-400/30"
                        : "bg-purple-400/30"
                  } blur-xl`}
                  whileHover={{ scale: 1.5 }}
                />

                <motion.div
                  animate={{
                    y: [-2, 2, -2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                >
                  <step.icon className="w-8 h-8 text-white relative z-10" />
                </motion.div>
              </motion.div>

              <motion.div
                className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold text-primary relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.3,
                  }}
                >
                  {step.number}
                </motion.div>

                {/* Connecting line to next step */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="absolute left-full top-1/2 w-8 h-0.5 bg-gradient-to-r from-primary/40 to-transparent hidden md:block"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 + index * 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                )}
              </motion.div>

              <motion.h3
                className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {step.title}
              </motion.h3>

              <motion.p
                className="text-muted-foreground leading-relaxed"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.p
            className="text-muted-foreground mb-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            Ready to deploy your first project?
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge
              variant="secondary"
              onClick={() => router.push("/new")}
              className="px-6 py-2 text-sm cursor-pointer bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
            >
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                Start deploying now →
              </motion.div>
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
