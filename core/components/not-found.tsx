"use client"

import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, Rocket, Sparkles, Star, Code, GitBranch, Zap, RefreshCw } from "lucide-react"
import { useRef } from "react"

export default function NotFound() {
  const router = useRouter()
  const ref = useRef(null)

  const containerVariants: Variants = {
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

  const floatingVariants:Variants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 180, 360],
      transition: {
        duration: 15,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  }

  return (
    <div className="min-h-screen mt-10 flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Animated Background Elements */}
      <motion.div className="absolute top-20 left-10 text-blue-500/10" variants={floatingVariants} animate="animate">
        <Code className="w-24 h-24" />
      </motion.div>

      <motion.div
        className="absolute top-1/4 right-20 text-purple-500/10"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <GitBranch className="w-16 h-16" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-1/4 text-green-500/10"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 4 }}
      >
        <Sparkles className="w-20 h-20" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-10 text-indigo-500/10"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Zap className="w-18 h-18" />
      </motion.div>

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-purple-400/15 to-indigo-600/15 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Main Content */}
      <motion.div
        ref={ref}
        className="container mx-auto px-4 text-center relative z-10 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <Badge
            variant="outline"
            className="px-6 py-3 text-lg font-medium backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-lg"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1, ease: "linear" }}
            >
              <Star className="w-5 h-5 mr-2" />
            </motion.div>
            Error 404
          </Badge>
        </motion.div>

        {/* Large 404 Number */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1
            className="text-8xl md:text-9xl lg:text-[12rem] font-bold leading-none"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.span
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                background: "linear-gradient(90deg, #2563eb, #9333ea, #4f46e5, #2563eb)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              404
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Title and Description */}
        <motion.div variants={itemVariants} className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Oops! Page not found</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The page you&apos;re looking for seems to have been deployed to a different dimension. Let&apos;s get you back to
            familiar territory.
          </p>
        </motion.div>

        {/* Animated Rocket */}
        <motion.div variants={itemVariants} className="mb-12 flex justify-center">
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.1,
              rotate: [0, -10, 10, -10, 0],
            }}
          >
            <Rocket className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="text-lg px-8 py-4 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => router.push("/")}
            >
              <Home className="mr-2 w-5 h-5" />
              Go Home
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 backdrop-blur-sm cursor-pointer bg-white/10 border-white/20 hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Go Back
            </Button>
          </motion.div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {[
            { href: "/projects", icon: Rocket, label: "Projects", description: "View your deployments" },
            { href: "/new", icon: Zap, label: "New Project", description: "Deploy something new" },
            { href: "/", icon: Home, label: "Home", description: "Back to homepage" },
          ].map((link, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href={link.href}>
                <div className="p-6 rounded-lg border-2 border-transparent hover:border-primary/20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg group cursor-pointer">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform"
                    whileHover={{
                      x: [-2, 2, -2, 2, 0],
                      y: [-2, 2, -2, 2, 0],
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <link.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Fun Message */}
        <motion.div
          variants={itemVariants}
          className="mt-16 p-6 rounded-lg bg-muted/50 backdrop-blur-sm border border-white/20"
        >
          <motion.p
            className="text-muted-foreground text-sm"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            💡 <strong>Pro tip:</strong> While you&apos;re here, why not deploy a new project? It only takes a few clicks
            with Deployr!
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Loading Animation for Fun */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          whileHover={{ scale: 1.1 }}
          onClick={() => router.refresh()}
        >
          <RefreshCw className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>
    </div>
  )
}
