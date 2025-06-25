"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, RefreshCw, ExternalLink, Github, Globe } from "lucide-react"
import { getTimeAgo } from "@/lib/utils"

interface DeploymentStatusProps {
  deployment: {
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
    envVars: Array<{ key: string; value: string }>
  }
}

const statusConfig = {
  PENDING: {
    color: "bg-yellow-500",
    icon: Clock,
    label: "Pending",
    description: "Deployment is queued",
  },
  BUILDING: {
    color: "bg-blue-500",
    icon: RefreshCw,
    label: "Building",
    description: "Your project is being built",
  },
  DEPLOYED: {
    color: "bg-green-500",
    icon: CheckCircle,
    label: "Deployed",
    description: "Successfully deployed",
  },
  FAILED: {
    color: "bg-red-500",
    icon: XCircle,
    label: "Failed",
    description: "Deployment failed",
  },
}

export function DeploymentStatus({ deployment: initialDeployment }: DeploymentStatusProps) {
  const [deployment, setDeployment] = useState(initialDeployment)
  const [polling, setPolling] = useState(false)

  const status = statusConfig[deployment.status as keyof typeof statusConfig] || statusConfig.PENDING
  const StatusIcon = status.icon

  // Poll for status updates if building
  useEffect(() => {
    if (deployment.status === "BUILDING" || deployment.status === "PENDING") {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/deployments/${deployment.id}`)
          if (response.ok) {
            const updated = await response.json()
            setDeployment(updated)

            // Stop polling if deployment is complete
            if (updated.status === "DEPLOYED" || updated.status === "FAILED") {
              clearInterval(interval)
            }
          }
        } catch (error) {
          console.error("Failed to fetch deployment status:", error)
        }
      }, 5000) // Poll every 5 seconds

      return () => clearInterval(interval)
    }
  }, [deployment.status, deployment.id])

  const refreshStatus = async () => {
    setPolling(true)
    try {
      const response = await fetch(`/api/deployments/${deployment.id}`)
      if (response.ok) {
        const updated = await response.json()
        setDeployment(updated)
      }
    } catch (error) {
      console.error("Failed to refresh status:", error)
    } finally {
      setPolling(false)
    }
  }

  const deploymentUrl = `https://${deployment.slug}.deployr.app`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{deployment.name}</h1>
          <p className="text-muted-foreground">Deployment Status</p>
        </div>
        <Button onClick={refreshStatus} disabled={polling} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${polling ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${status.color} ${deployment.status === "BUILDING" ? "animate-pulse" : ""}`}
              />
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <StatusIcon className={`w-5 h-5 ${deployment.status === "BUILDING" ? "animate-spin" : ""}`} />
                  <span>{status.label}</span>
                </CardTitle>
                <CardDescription>{status.description}</CardDescription>
              </div>
            </div>
            {deployment.status === "DEPLOYED" && (
              <Button asChild>
                <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Site
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Project</div>
              <div className="font-medium">{deployment.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Branch</div>
              <div className="font-medium">{deployment.branch || "main"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <div className="font-medium">{getTimeAgo(deployment.createdAt)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Updated</div>
              <div className="font-medium">{getTimeAgo(deployment.updatedAt)}</div>
            </div>
          </div>

          {deployment.repo_url && (
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Github className="w-4 h-4" />
              <a
                href={deployment.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center"
              >
                {deployment.repo_url}
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployment URL */}
      {deployment.status === "DEPLOYED" && (
        <Card>
          <CardHeader>
            <CardTitle>Deployment URL</CardTitle>
            <CardDescription>Your project is live at this URL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <code className="text-sm">{deploymentUrl}</code>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(deploymentUrl)}>
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs */}
      {deployment.logs && (
        <Card>
          <CardHeader>
            <CardTitle>Deployment Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto">{deployment.logs}</pre>
          </CardContent>
        </Card>
      )}

      {/* Environment Variables */}
      {deployment.envVars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Variables configured for this deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {deployment.envVars.map((env, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <code className="text-sm font-medium">{env.key}</code>
                  <Badge variant="secondary">Set</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
