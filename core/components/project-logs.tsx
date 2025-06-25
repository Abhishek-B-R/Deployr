"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Download, Terminal } from "lucide-react"

interface ProjectLogsProps {
  project: {
    id: string
    logs: string | null
    status: string
  }
}

export function ProjectLogs({ project }: ProjectLogsProps) {
  const [logs, setLogs] = useState(project.logs || "")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshLogs = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/deployments/${project.id}/logs`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || "No logs available")
      }
    } catch (error) {
      console.error("Failed to refresh logs:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const downloadLogs = () => {
    const blob = new Blob([logs], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.id}-logs.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="w-5 h-5" />
              <span>Deployment Logs</span>
            </CardTitle>
            <CardDescription>Real-time logs from your deployment process</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={project.status === "BUILDING" ? "default" : "secondary"}>
              {project.status === "BUILDING" ? "Live" : "Static"}
            </Badge>
            <Button variant="outline" size="sm" onClick={refreshLogs} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={downloadLogs}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto font-mono">
            {logs || "No logs available yet..."}
          </pre>
          {project.status === "BUILDING" && (
            <div className="absolute bottom-2 right-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
