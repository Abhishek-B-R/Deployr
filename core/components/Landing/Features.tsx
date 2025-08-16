"use client"

import { Brain, Globe, Monitor, Zap, Sparkles, Star, Code, Rocket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { motion, useInView, Variants } from "framer-motion"
import { useRef } from "react"
import { useRouter } from "next/navigation"

export default function Features() {
  const ref = useRef(null)
  const router = useRouter()
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants:Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const headerVariants:Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const features = [
    {
      icon: Zap,
      title: "One-Click Deploy",
      description: "From repository to live site in seconds. Zero configuration required for popular frameworks.",
      gradient: "from-blue-500 to-blue-600",
      hoverBorder: "hover:border-blue-200 dark:hover:border-blue-800",
      glowColor: "blue",
    },
    {
      icon: Globe,
      title: "Instant Preview Links",
      description: "Shareable preview URLs for every deployment and pull request. Perfect for client reviews.",
      gradient: "from-green-500 to-green-600",
      hoverBorder: "hover:border-green-200 dark:hover:border-green-800",
      glowColor: "green",
    },
    {
      icon: Brain,
      title: "Smart Build Detection",
      description: "Automatically detects React, Vue, Angular, and other frameworks. Optimizes builds automatically.",
      gradient: "from-gray-500 to-gray-600",
      hoverBorder: "hover:border-gray-200 dark:hover:border-gray-800",
      glowColor: "gray",
    },
    {
      icon: Monitor,
      title: "Live Deployment Logs",
      description: "Real-time visibility into your deployment process with detailed build logs and error reporting.",
      gradient: "from-orange-500 to-orange-600",
      hoverBorder: "hover:border-orange-200 dark:hover:border-orange-800",
      glowColor: "orange",
    },
  ]

  return (
    <section ref={ref} id="features" className="py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-10 left-10 text-blue-500/10"
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Code className="w-16 h-16" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-10 text-gray-500/10"
        animate={{
          y: [20, -20, 20],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Rocket className="w-12 h-12" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-1/4 text-green-500/10"
        animate={{
          x: [-10, 10, -10],
          y: [-10, 10, -10],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-14 h-14" />
      </motion.div>

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-gray-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-to-r from-green-400/15 to-blue-600/15 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
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
              Features
            </Badge>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Everything you need to deploy with{" "}
            <motion.span
              className="bg-gradient-to-r from-blue-600 via-gray-600 to-indigo-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                background: "linear-gradient(90deg, #2563eb, #718096, #2563eb)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              confidence
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Powerful features that make frontend deployment simple, fast, and reliable for developers.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 ${feature.hoverBorder} relative overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80`}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${
                    feature.glowColor === "blue"
                      ? "from-blue-400/20 to-blue-600/20"
                      : feature.glowColor === "green"
                        ? "from-green-400/20 to-green-600/20"
                        : feature.glowColor === "gray"
                          ? "from-gray-400/20 to-gray-600/20"
                          : "from-orange-400/20 to-orange-600/20"
                  }`}
                />

                <CardContent className="p-6 relative z-10">
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    whileHover={{
                      x: [-2, 2, -2, 2, 0],
                      y: [-2, 2, -2, 2, 0],
                      scale: 1.15,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      animate={{
                        y: [-1, 1, -1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: index * 0.5,
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>

                  <motion.h3
                    className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {feature.title}
                  </motion.h3>

                  <motion.p
                    className="text-muted-foreground text-sm leading-relaxed"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.description}
                  </motion.p>

                  {/* Animated border on hover */}
                  <motion.div
                    className="absolute inset-0 border-2 border-transparent rounded-lg"
                    whileHover={{
                      borderColor:
                        feature.glowColor === "blue"
                          ? "#3b82f6"
                          : feature.glowColor === "green"
                            ? "#10b981"
                            : feature.glowColor === "gray"
                              ? "#8b5cf6"
                              : "#f97316",
                      boxShadow: `0 0 20px ${
                        feature.glowColor === "blue"
                          ? "#3b82f620"
                          : feature.glowColor === "green"
                            ? "#10b98120"
                            : feature.glowColor === "gray"
                              ? "#8b5cf620"
                              : "#f9731620"
                      }`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.p
            className="text-muted-foreground mb-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            Ready to experience the future of deployment?
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge
              variant="secondary"
              onClick={()=>{router.push("/new")}}
              className="px-6 py-2 text-sm cursor-pointer bg-gradient-to-r from-blue-500/10 to-gray-500/10 hover:from-blue-500/20 hover:to-gray-500/20 transition-all duration-300"
            >
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                Get started for free →
              </motion.div>
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
