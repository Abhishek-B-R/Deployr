"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Terminal,
  Download,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pause,
  Play,
  Trash2,
} from "lucide-react"
import { useBuildLogs } from "@/hooks/use-build-logs"
import { cn } from "@/lib/utils"

interface LiveBuildLogsProps {
  projectId: string
  projectName: string
  onLogsComplete?: (logs: string) => void
  className?: string
}

export function LiveBuildLogs({ projectId, projectName, onLogsComplete, className }: LiveBuildLogsProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { logs, isConnected, isComplete, error, clearLogs, retry, formattedLogs } = useBuildLogs({
    projectId,
    onLogsComplete,
  })

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && !isPaused && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, autoScroll, isPaused])

  const downloadLogs = () => {
    const blob = new Blob([formattedLogs], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${projectName}-build-logs-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-400"
      case "warning":
        return "text-yellow-400"
      case "success":
        return "text-green-400"
      default:
        return "text-green-400"
    }
  }

  const getConnectionStatus = () => {
    if (error) {
      return { icon: XCircle, color: "text-red-500", label: "Error" }
    }
    if (isComplete) {
      return { icon: CheckCircle, color: "text-green-500", label: "Complete" }
    }
    if (isConnected) {
      return { icon: Wifi, color: "text-green-500", label: "Connected" }
    }
    return { icon: WifiOff, color: "text-red-500", label: "Disconnected" }
  }

  const status = getConnectionStatus()
  const StatusIcon = status.icon

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="w-5 h-5" />
              <span>Live Build Logs</span>
            </CardTitle>
            <CardDescription>Real-time build logs for {projectName}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <StatusIcon className={cn("w-3 h-3", status.color)} />
              <span>{status.label}</span>
            </Badge>
            {logs.length > 0 && <Badge variant="secondary">{logs.length} lines</Badge>}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)} disabled={isComplete}>
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              )}
            </Button>

            <Button variant="outline" size="sm" onClick={() => setAutoScroll(!autoScroll)}>
              Auto-scroll: {autoScroll ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {error && (
              <Button variant="outline" size="sm" onClick={retry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={clearLogs}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>

            <Button variant="outline" size="sm" onClick={downloadLogs} disabled={logs.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <ScrollArea ref={scrollAreaRef} className="h-96 w-full rounded-md border bg-black p-4">
            <div className="font-mono text-sm space-y-1">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  {error ? (
                    <div className="space-y-2">
                      <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
                      <p>Connection error: {error}</p>
                      <Button variant="outline" size="sm" onClick={retry}>
                        Try Again
                      </Button>
                    </div>
                  ) : isConnected ? (
                    <div className="space-y-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mx-auto"></div>
                      <p>Waiting for build logs...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-500" />
                      <p>Connecting to build logs...</p>
                    </div>
                  )}
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={cn(
                      "whitespace-pre-wrap break-words",
                      getLogTypeColor(log.type || "info"),
                      isPaused && "opacity-60",
                    )}
                  >
                    <span className="text-gray-500 text-xs">[{log.timestamp.toLocaleTimeString()}]</span> {log.message}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Live indicator */}
          {isConnected && !isComplete && !isPaused && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>LIVE</span>
              </div>
            </div>
          )}

          {/* Paused indicator */}
          {isPaused && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center space-x-1 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium">
                <Pause className="w-3 h-3" />
                <span>PAUSED</span>
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Status: {status.label}</span>
            {logs.length > 0 && <span>Last update: {logs[logs.length - 1]?.timestamp.toLocaleTimeString()}</span>}
          </div>

          {isComplete && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Logs saved to database</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
