"use client"

import { useState, useEffect, useCallback } from "react"
import { NeoCard, NeoButton, NeoBadge } from "@/components/neo-ui"
import { RefreshCw, Download, Terminal, History, Wifi, WifiOff, FileText, ArrowDown } from "lucide-react"
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

  // Auto switch logic
  useEffect(() => {
    if (isLive && logs.length > 0) {
      setActiveTab("live")
    }
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
    <div className="space-y-8">
      {/* Brutalist Tabs */}
      <div className="flex w-full border-4 border-neo-black bg-white shadow-neo-sm p-1">
        <button 
          onClick={() => setActiveTab("live")}
          className={`flex-1 py-3 px-4 font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer ${
            activeTab === "live" 
              ? "bg-neo-black text-white" 
              : "bg-white text-gray-400 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <Terminal className="w-5 h-5" />
          Live Logs
          {isLive && <div className="w-3 h-3 bg-red-500 rounded-none animate-pulse" />}
        </button>
        
        <div className="w-1 bg-neo-black"></div>
        
        <button 
          onClick={() => setActiveTab("stored")}
          className={`flex-1 py-3 px-4 font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer ${
            activeTab === "stored" 
              ? "bg-neo-black text-white" 
              : "bg-white text-gray-400 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <History className="w-5 h-5" />
          Stored Logs
        </button>
      </div>

      {activeTab === "live" ? (
        <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
          <LiveBuildLogs projectId={project.id} projectName={project.name} showAsActive={isLive} />
        </div>
      ) : (
        <NeoCard className="animate-in fade-in duration-300 slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-6 border-b-4 border-neo-black pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-neo-yellow p-2 border-2 border-neo-black shadow-neo-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl uppercase">Archived Logs</h3>
                <p className="text-gray-500 font-mono text-xs">Access past deployment records</p>
              </div>
            </div>
            <div className="flex gap-2">
              <NeoButton variant="ghost" size="sm" onClick={refreshStoredLogs} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </NeoButton>
              <NeoButton
                variant="primary"
                size="sm"
                onClick={() => downloadLogs(storedLogs, `${project.name}-stored-logs.txt`)}
                disabled={!storedLogs}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </NeoButton>
            </div>
          </div>

          <div className="relative bg-gray-50 border-4 border-gray-200 p-1">
            <pre className="bg-white p-6 h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap text-gray-700 neo-scrollbar border-2 border-dashed border-gray-300">
              {storedLogs || <span className="text-gray-400 italic">No stored logs available for this deployment yet...</span>}
            </pre>
            {!storedLogs && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white border-2 border-black p-4 shadow-neo-sm rotate-3 opacity-50">
                  <h4 className="font-black text-lg">LOGS_EMPTY</h4>
                </div>
              </div>
            )}
          </div>
        </NeoCard>
      )}
    </div>
  )
}