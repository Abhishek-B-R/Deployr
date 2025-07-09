"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Globe,
  Github,
  GitBranch,
  Clock,
  Eye,
  ExternalLink,
  Settings,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  RefreshCw,
  Rocket,
  Calendar,
  Activity,
  CheckIcon,
  Ban,
  Sparkles,
} from "lucide-react"
import { getTimeAgo } from "@/lib/utils"
import NavBar from "../NavBar"
import Footer from "../Footer"
import { motion, useInView, Variants } from "framer-motion"
import { useRef } from "react"

interface Project {
  id: string
  name: string
  repo_name: string | null
  repo_url: string | null
  branch: string | null
  slug: string
  status: string
  logs: string | null
  createdAt: Date
  updatedAt: Date
  views: number
  size: number | null
  private: boolean
  envVars: Array<{ key: string; value: string }>
  user: {
    name: string | null
    email: string
  }
}

interface ProjectsListProps {
  projects: Project[]
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

const statusConfig = {
  PENDING: { color: "bg-yellow-500", icon: Clock, variant: "secondary" as const, label: "Pending" },
  BUILDING: { color: "bg-blue-500", icon: RefreshCw, variant: "default" as const, label: "Building" },
  DEPLOYED: { color: "bg-green-500", icon: CheckCircle, variant: "default" as const, label: "Live" },
  FAILED: { color: "bg-red-500", icon: XCircle, variant: "destructive" as const, label: "Failed" },
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.repo_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Header */}
      <NavBar />

      {/* Floating Background Elements */}
      <motion.div
        className="fixed top-20 right-10 text-blue-500/5 pointer-events-none z-0"
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
        <Rocket className="w-32 h-32" />
      </motion.div>

      <motion.div
        className="fixed bottom-20 left-10 text-purple-500/5 pointer-events-none z-0"
        animate={{
          y: [15, -15, 15],
          rotate: [0, -90, -180, -270, -360],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Sparkles className="w-24 h-24" />
      </motion.div>

      {/* Main Content */}
      <main ref={ref} className="flex-1 container mx-auto px-4 py-8 relative z-10 max-w-full">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-muted-foreground">Manage and monitor your deployed projects</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              className="relative flex-1"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:shadow-lg"
              />
            </motion.div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="flex items-center gap-2 min-w-fit bg-transparent">
                    <Filter className="w-4 h-4" />
                    Status:{" "}
                    {statusFilter === "all" ? "All" : statusConfig[statusFilter as keyof typeof statusConfig]?.label}
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Projects</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("BUILD_SUCCESS")}>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Live
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("BUILDING")}>
                  <RefreshCw className="w-4 h-4 mr-2 text-blue-500" />
                  Building
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("BUILD_FAILED")}>
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                  Failed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>
                  <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {projects.length === 0 ? (
                <div className="space-y-4">
                  <motion.div
                    className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Rocket className="w-8 h-8 text-muted-foreground" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">Get started by deploying your first project</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild>
                        <Link href="/new">
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Project
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <motion.div
                    className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {filteredProjects.map((project) => {
                const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.PENDING
                const StatusIcon = status.icon
                const deploymentUrl = `https://${project.slug}.deployr.live`

                return (
                  <motion.div key={project.id} variants={itemVariants}>
                    <Card
                      className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/20 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 relative overflow-hidden"
                      onClick={() => router.push(`/projects/${project.id}/overview`)}
                    >
                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        whileHover={{ scale: 1.02 }}
                      />

                      <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1 min-w-0">
                            <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                              <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                                {project.name}
                              </CardTitle>
                            </motion.div>
                            <div className="flex items-center space-x-2 flex-wrap">
                              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                                <Badge variant={status.variant} className="flex items-center space-x-1">
                                  <StatusIcon
                                    className={`w-3 h-3 ${project.status === "BUILDING" ? "animate-spin" : "hidden"}`}
                                  />
                                  <CheckIcon
                                    className={`w-3 h-3 ${project.status === "BUILD_SUCCESS" ? "block text-green-500" : "hidden"}`}
                                  />
                                  <Ban
                                    className={`w-3 h-3 ${project.status === "BUILD_FAILED" ? "block text-red-500" : "hidden"}`}
                                  />
                                  <span>
                                    {project.status === "BUILD_SUCCESS"
                                      ? "Deployed"
                                      : project.status === "BUILD_FAILED"
                                        ? "Failed"
                                        : project.status}
                                  </span>
                                </Badge>
                              </motion.div>
                              {project.private && (
                                <Badge variant="outline" className="text-xs">
                                  Private
                                </Badge>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem  className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/projects/${project.id}/overview`)
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Project
                              </DropdownMenuItem>
                              {project.status === "BUILD_SUCCESS" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(deploymentUrl, "_blank")
                                  }}
                                >
                                  <Globe className="w-4 h-4 mr-2" />
                                  Visit Site
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/projects/${project.id}/settings`)
                                }}
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {project.repo_url && (
                                <DropdownMenuItem className="cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(project.repo_url!, "_blank")
                                  }}
                                >
                                  <Github className="w-4 h-4 mr-2" />
                                  View Source
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4 relative z-10">
                        {/* Project URL */}
                        {project.status === "BUILD_SUCCESS" && (
                          <motion.div
                            className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg"
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.05)" }}
                            transition={{ duration: 0.2 }}
                          >
                            <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <code className="text-sm truncate flex-1">{project.slug}.deployr.live</code>
                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(deploymentUrl, "_blank")
                                }}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}

                        {/* Repository Info */}
                        {project.repo_url && (
                          <motion.div
                            className="flex items-center space-x-2 text-sm text-muted-foreground"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Github className="w-4 h-4" />
                            <span className="truncate">{project.repo_name}</span>
                            {project.branch && (
                              <>
                                <GitBranch className="w-3 h-3" />
                                <span>{project.branch}</span>
                              </>
                            )}
                          </motion.div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                          {[
                            { icon: Eye, value: project.views.toLocaleString(), label: "Views" },
                            {
                              icon: Activity,
                              value: project.size ? formatBytes(project.size) : "—",
                              label: "Size",
                            },
                            { icon: Calendar, value: getTimeAgo(project.updatedAt), label: "Updated" },
                          ].map((stat, statIndex) => (
                            <motion.div
                              key={statIndex}
                              className="text-center"
                              whileHover={{ scale: 1.05, y: -2 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <div className="flex items-center justify-center space-x-1">
                                <stat.icon className="w-3 h-3 text-muted-foreground" />
                                <span className="text-sm font-medium">{stat.value}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
