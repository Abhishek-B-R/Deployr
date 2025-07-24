"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Download, Terminal, History, Wifi, WifiOff } from "lucide-react"
import { LiveBuildLogs } from "@/components/ProjectOverview/live-build-logs"
import { useBuildLogs } from "@/hooks/use-build-logs"

interface ProjectLogsProps {
  project: {
    id: string
    name: string
    logs: string | null
    status: string
  }
}

export function ProjectLogs({ project }: ProjectLogsProps) {
  const [storedLogs, setStoredLogs] = useState(project.logs || "")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"live" | "stored">("stored")

  // 🟢 Memoized handlers to avoid re-creating them on each render
  const handleReceiveMessage = useCallback(() => {
    setActiveTab("live")
  }, [])

  const handleLogsComplete = useCallback((completedLogs: string) => {
    setStoredLogs(completedLogs)
    setActiveTab("stored")
  }, [])

  const { isLive, isConnected, logs } = useBuildLogs({
    projectId: project.id,
    onReceiveMessage: handleReceiveMessage,
    onLogsComplete: handleLogsComplete,
  })

  // Auto switch between live and stored based on activity
  useEffect(() => {
    (async ()=>{
      if (isLive && logs.length > 0) {
      setActiveTab("live")
    }
  })()
  }, [isLive, logs.length])

  const refreshStoredLogs = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/projects/${project.id}/logs`)
      if (response.ok) {
        const data = await response.json()
        setStoredLogs(data.logs || "No logs available")
      }
    } catch (error) {
      console.error("Failed to refresh logs:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const downloadLogs = (logs: string, filename: string) => {
    const blob = new Blob([logs], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "live" | "stored")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live" className="flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <span>Live Logs</span>
            {isLive && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            {isConnected ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
          </TabsTrigger>
          <TabsTrigger value="stored" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>Stored Logs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <LiveBuildLogs projectId={project.id} projectName={project.name} showAsActive={isLive} />
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
                  <Badge variant="secondary">Stored</Badge>
                  <Button variant="outline" size="sm" onClick={refreshStoredLogs} disabled={isRefreshing}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadLogs(storedLogs, `${project.name}-stored-logs.txt`)}
                    disabled={!storedLogs}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto font-mono whitespace-pre-wrap">
                  {storedLogs || "No stored logs available yet..."}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
