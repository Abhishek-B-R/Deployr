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
} from "lucide-react"
import { getTimeAgo } from "@/lib/utils"
import NavBar from "../NavBar"
import Footer from "../Footer"

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

  return (
    <>
      {/* Header */}
      <NavBar/>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-muted-foreground">Manage and monitor your deployed projects</p>
            </div>
            <Button asChild>
              <Link href="/new">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Link>
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Status:{" "}
                  {statusFilter === "all" ? "All" : statusConfig[statusFilter as keyof typeof statusConfig]?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Projects</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("DEPLOYED")}>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Live
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("BUILDING")}>
                  <RefreshCw className="w-4 h-4 mr-2 text-blue-500" />
                  Building
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("FAILED")}>
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                  Failed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>
                  <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              {projects.length === 0 ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Rocket className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">Get started by deploying your first project</p>
                    <Button asChild>
                      <Link href="/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Project
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.PENDING
                const StatusIcon = status.icon
                const deploymentUrl = `https://${project.slug}.deployr.app`

                return (
                  <Card
                    key={project.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/20"
                    onClick={() => router.push(`/projects/${project.id}/overview`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1 min-w-0">
                          <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                            {project.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant={status.variant} className="flex items-center space-x-1">
                              <StatusIcon
                                className={`w-3 h-3 ${project.status === "BUILDING" ? "animate-spin" : ""}`}
                              />
                              <span>{status.label}</span>
                            </Badge>
                            {project.private && (
                              <Badge variant="outline" className="text-xs">
                                Private
                              </Badge>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/projects/${project.id}/overview`)
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Project
                            </DropdownMenuItem>
                            {project.status === "DEPLOYED" && (
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
                            <DropdownMenuItem
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
                              <DropdownMenuItem
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
                    <CardContent className="space-y-4">
                      {/* Project URL */}
                      {project.status === "DEPLOYED" && (
                        <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                          <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <code className="text-sm truncate flex-1">{project.slug}.deployr.app</code>
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
                        </div>
                      )}

                      {/* Repository Info */}
                      {project.repo_url && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Github className="w-4 h-4" />
                          <span className="truncate">{project.repo_name}</span>
                          {project.branch && (
                            <>
                              <GitBranch className="w-3 h-3" />
                              <span>{project.branch}</span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Eye className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{project.views.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Activity className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {project.size ? formatBytes(project.size) : "—"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Size</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{getTimeAgo(project.updatedAt)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Updated</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </>
  )
}
