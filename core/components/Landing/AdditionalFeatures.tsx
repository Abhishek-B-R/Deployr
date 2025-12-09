"use client";

import { Shield, Globe, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AdditionalFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Shield,
      title: "SSL & Security",
      description:
        "Automatic SSL certificates and secure HTTPS for all your deployments.",
      color: "text-green-500",
    },
    {
      icon: Globe,
      title: "Global Edge Network",
      description:
        "Lightning-fast content delivery through our worldwide CDN infrastructure.",
      color: "text-blue-500",
    },
    {
      icon: Settings,
      title: "Environment Variables",
      description:
        "Secure configuration management with encrypted environment variables.",
      color: "text-gray-500",
    },
  ];

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-linear-to-r from-blue-400/10 to-gray-600/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge
                variant="outline"
                className="mb-4 px-4 py-2 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-lg"
              >
                Advanced Features
              </Badge>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Built for{" "}
              <motion.span
                className="bg-linear-to-r from-blue-600 via-gray-600 to-indigo-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  background:
                    "linear-gradient(90deg, #2563eb, #2563eb, #718096, #2563eb)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                modern frontend
              </motion.span>{" "}
              development
            </motion.h2>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{
                      x: [-2, 2, -2, 2, 0],
                      y: [-2, 2, -2, 2, 0],
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <feature.icon
                      className={`w-5 h-5 ${feature.color} mt-1 shrink-0`}
                    />
                  </motion.div>
                  <div>
                    <motion.h4
                      className="font-semibold group-hover:text-primary transition-colors"
                      whileHover={{ y: -1 }}
                    >
                      {feature.title}
                    </motion.h4>
                    <motion.p
                      className="text-muted-foreground text-sm leading-relaxed"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {feature.description}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 shadow-2xl border backdrop-blur-sm"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <h3 className="font-semibold text-lg">
                    Deployment Dashboard
                  </h3>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Badge variant="secondary">Live</Badge>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  {[
                    {
                      name: "my-react-app",
                      status: "success",
                      time: "2 min ago",
                      building: false,
                    },
                    {
                      name: "portfolio-site",
                      status: "building",
                      time: "Building...",
                      building: true,
                    },
                    {
                      name: "vue-dashboard",
                      status: "success",
                      time: "1 hour ago",
                      building: false,
                    },
                  ].map((project, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                      }
                      transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className={`w-2 h-2 rounded-full ${
                            project.building
                              ? "bg-blue-500"
                              : project.status === "success"
                              ? "bg-green-500"
                              : "bg-red-500"
                          } ${project.building ? "animate-pulse" : ""}`}
                          animate={
                            project.building
                              ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }
                              : { scale: [1, 1.1, 1] }
                          }
                          transition={{
                            duration: project.building ? 1 : 3,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        />
                        <span className="font-medium">{project.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {project.time}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
