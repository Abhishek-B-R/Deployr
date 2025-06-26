"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Download, Terminal, History } from "lucide-react"
import { LiveBuildLogs } from "@/components/live-build-logs"

interface ProjectLogsProps {
  project: {
    id: string
    name: string
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
      const response = await fetch(`/api/projects/${project.id}/logs`)
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
    a.download = `${project.name}-logs.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleLogsComplete = (completedLogs: string) => {
    setLogs(completedLogs)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live" className="flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <span>Live Logs</span>
          </TabsTrigger>
          <TabsTrigger value="stored" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>Stored Logs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <LiveBuildLogs projectId={project.id} projectName={project.name} onLogsComplete={handleLogsComplete} />
        </TabsContent>

        <TabsContent value="stored" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Stored Deployment Logs</span>
                  </CardTitle>
                  <CardDescription>Previously saved logs from your deployment process</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={project.status === "BUILDING" ? "default" : "secondary"}>
                    {project.status === "BUILDING" ? "Live" : "Static"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={refreshLogs} disabled={isRefreshing}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadLogs} disabled={!logs}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto font-mono whitespace-pre-wrap">
                  {logs || "No stored logs available yet..."}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
