"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  Github,
  GitBranch,
  Clock,
  Eye,
  ExternalLink,
  Settings,
  RefreshCw,
  Activity,
  Zap,
  Shield,
  Copy,
  CheckCircle,
  XCircle,
  CheckIcon,
  Ban,
} from "lucide-react"
import { getTimeAgo } from "@/lib/utils"
import { ProjectLogs } from "@/components/ProjectOverview/project-logs"
import NavBar from "../NavBar"
import Footer from "../Footer"

interface ProjectOverviewProps {
  project: {
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
}

const statusConfig = {
  PENDING: { color: "bg-yellow-500", icon: Clock, variant: "secondary" as const },
  BUILDING: { color: "bg-blue-500", icon: RefreshCw, variant: "default" as const },
  DEPLOYED: { color: "bg-green-500", icon: CheckCircle, variant: "default" as const },
  FAILED: { color: "bg-red-500", icon: XCircle, variant: "destructive" as const },
}

export function ProjectOverview({ project: initialProject }: ProjectOverviewProps) {
  const [project, setProject] = useState(initialProject)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.PENDING
  const StatusIcon = status.icon
  const deploymentUrl = `https://${project.slug}.deployr.live`
  const isLive = project.status === "BUILDING";


  // Poll for status updates if building
  useEffect(() => {
    if (project.status === "BUILDING" || project.status === "PENDING") {
      setActiveTab("deployments")
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/deployments/${project.id}`)
          if (response.ok) {
            const updated = await response.json()
            setProject(updated)

            if (updated.status === "DEPLOYED" || updated.status === "FAILED") {
              clearInterval(interval)
            }
          }
        } catch (error) {
          console.error("Failed to fetch project status:", error)
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [project.status, project.id])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen px-16 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <NavBar/>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Status Banner */}
          {project.status === "FAILED" && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
              <CardContent className="flex items-center space-x-3 p-4">
                <XCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-100">Deployment Failed</p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    There was an error deploying your project. Check the logs below for details.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                  Retry Deployment
                </Button>
              </CardContent>
            </Card>
          )}

          {project.status === "BUILDING" && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
              <CardContent className="flex items-center space-x-3 p-4">
                <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Deployment in Progress</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your project is currently being built and deployed.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Overview Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Domain</p>
                    <p className="text-sm text-muted-foreground">{project.slug}.deployr.live</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-green-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Views</p>
                    <p className="text-sm text-muted-foreground">{project.views.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Last Updated</p>
                    <p className="text-sm text-muted-foreground">{getTimeAgo(project.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Size</p>
                    <p className="text-sm text-muted-foreground">
                      {project.size ? formatBytes(project.size) : "Unknown"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deployments" className="flex items-center space-x-2">
                <span>Deployments</span>
                {isLive && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              </TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Project Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Github className="w-5 h-5" />
                      <span>Repository</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.repo_url && (
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Source</p>
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center"
                          >
                            {project.repo_url.replace("https://github.com/", "")}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Branch</p>
                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-3 h-3" />
                          <span className="text-sm text-muted-foreground">{project.branch || "main"}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Project ID</p>
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{project.id}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(project.id)}
                          className="h-6 px-2"
                        >
                          {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Deployment URL */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="w-5 h-5" />
                      <span>Deployment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Production URL</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 p-3 bg-muted rounded-lg">
                          <code className="text-sm">{deploymentUrl}</code>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(deploymentUrl)}>
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Status</p>
                        <Badge variant={status.variant} className="flex items-center space-x-1 w-fit">
                          <StatusIcon
                            className={`w-3 h-3 ${project.status === "BUILDING" ? "animate-spin" : "hidden"}`}
                          />
                          <CheckIcon
                            className={`w-3 h-3 ${project.status === "BUILD_SUCCESS" ? "block text-green-500" : "hidden"}`}
                          />
                          <Ban
                            className={`w-3 h-3 ${project.status === "BUILD_FAILED" ? "block text-red-500" : "hidden"}`}
                          />
                          <span>{project.status==="BUILD_SUCCESS"?"Deployed":project.status==="BUILD_FAILED"?"Failed":project.status}</span>
                        </Badge>
                      </div>
                      {project.status === "DEPLOYED" && (
                        <Button asChild>
                          <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit
                          </a>
                        </Button>
                      )}
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {project.private ? "Private project" : "Public project"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Environment Variables */}
              {project.envVars.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Environment Variables</CardTitle>
                    <CardDescription>Variables configured for this deployment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.envVars.map((env, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <code className="text-sm font-medium">{env.key}</code>
                          <Badge variant="secondary">Set</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="deployments">
              <ProjectLogs project={project} />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View your project&apos;s performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground">We&apos;re working on detailed analytics for your deployments.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Settings</CardTitle>
                  <CardDescription>Manage your project configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href={`/projects/${project.id}/settings`}>
                      <Settings className="w-4 h-4 mr-2" />
                      Open Project Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer/>
    </div>
  )
}
