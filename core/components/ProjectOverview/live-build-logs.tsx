"use client"

import { useState, useEffect, useRef } from "react"
import { NeoCard, NeoButton, NeoBadge } from "@/components/neo-ui"
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
  showAsActive?: boolean
}

export function LiveBuildLogs({
  projectId,
  projectName,
  onLogsComplete,
  className,
  showAsActive = false,
}: LiveBuildLogsProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { logs, isConnected, isComplete, isLive, error, clearLogs, retry, formattedLogs } = useBuildLogs({
    projectId,
    onLogsComplete,
  })

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && !isPaused && bottomRef.current && (isLive || showAsActive)) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs, autoScroll, isPaused, isLive, showAsActive])

  const downloadLogs = () => {
    const blob = new Blob([formattedLogs], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${projectName}-live-logs-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-500 font-bold bg-red-900/20"
      case "warning":
        return "text-neo-yellow font-bold"
      case "success":
        return "text-neo-green font-bold"
      default:
        return "text-gray-300"
    }
  }

  const getConnectionStatus = () => {
    if (error) {
      return { icon: XCircle, color: "bg-red-500", label: "ERROR" }
    }
    if (isComplete) {
      return { icon: CheckCircle, color: "bg-neo-green", label: "COMPLETE" }
    }
    if (isConnected) {
      return { icon: Wifi, color: "bg-neo-blue", label: "CONNECTED" }
    }
    return { icon: WifiOff, color: "bg-gray-400", label: "CONNECTING..." }
  }

  const status = getConnectionStatus()
  const StatusIcon = status.icon

  return (
    <div className={cn("w-full font-mono", className)}>
      {/* Terminal Header */}
      <div className="bg-neo-black text-white p-3 flex items-center justify-between border-b-4 border-neo-black rounded-t-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white border-2 border-neo-black flex items-center justify-center text-black">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase">Live Build Logs</h3>
            <p className="text-xs text-gray-400 font-medium">{projectName}.exe</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("px-2 py-0.5 text-xs font-bold text-black border-2 border-white flex items-center gap-2", status.color)}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </div>
          {isLive && (
            <div className="bg-red-600 text-white px-2 py-0.5 text-xs font-bold border-2 border-white animate-pulse">
              LIVE
            </div>
          )}
        </div>
      </div>

      {/* Terminal Controls */}
      <div className="bg-gray-100 border-x-4 border-neo-black p-2 flex items-center justify-between border-b-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPaused(!isPaused)} 
            disabled={!isLive}
            className="px-3 py-1 bg-white border-2 border-neo-black shadow-neo-sm hover:shadow-none hover:translate-x-px hover:translate-y-px text-xs font-bold flex items-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            {isPaused ? "RESUME" : "PAUSE"}
          </button>
          <button 
            onClick={() => setAutoScroll(!autoScroll)}
            className={cn(
              "px-3 py-1 border-2 border-neo-black shadow-neo-sm hover:shadow-none hover:translate-x-px hover:translate-y-px text-xs font-bold transition-all cursor-pointer",
              autoScroll ? "bg-neo-yellow text-black" : "bg-white text-black"
            )}
          >
            AUTO-SCROLL: {autoScroll ? "ON" : "OFF"}
          </button>
        </div>
        <div className="flex gap-2">
          {error && (
            <button onClick={retry} className="p-1.5 bg-white border-2 border-neo-black shadow-neo-sm hover:bg-gray-50 cursor-pointer">
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button onClick={clearLogs} className="p-1.5 bg-white border-2 border-neo-black shadow-neo-sm hover:bg-red-100 hover:text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={downloadLogs} disabled={logs.length === 0} className="p-1.5 bg-white border-2 border-neo-black shadow-neo-sm hover:bg-neo-blue hover:text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="relative border-4 border-t-0 border-neo-black bg-[#0c0c0c] min-h-[400px]">
        <div ref={scrollAreaRef} className="h-96 overflow-y-auto p-4 neo-scrollbar">
          {/* CRT Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-size-[100%_4px,3px_100%]"></div>
          
          <div className="font-mono text-sm space-y-1 relative z-0">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-center py-20 flex flex-col items-center justify-center">
                {error ? (
                  <div className="space-y-4">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
                    <p className="text-red-500 font-bold">CONNECTION_ERROR: {error}</p>
                    <NeoButton variant="outline" size="sm" onClick={retry}>
                      RETRY CONNECTION
                    </NeoButton>
                  </div>
                ) : isConnected ? (
                  <div className="space-y-4">
                    <div className="w-3 h-3 bg-neo-green rounded-none animate-ping mx-auto"></div>
                    <p className="font-bold tracking-widest text-neo-green">SIGNAL ESTABLISHED. WAITING FOR DATA...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <RefreshCw className="w-12 h-12 mx-auto animate-spin text-neo-blue" />
                    <p className="font-bold tracking-widest text-neo-blue">INITIALIZING UPLINK...</p>
                  </div>
                )}
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={cn(
                    "whitespace-pre-wrap wrap-break-word border-l-2 pl-2 border-transparent hover:border-gray-700 hover:bg-white/5",
                    getLogTypeColor(log.type || "info"),
                    isPaused && "opacity-50",
                  )}
                >
                  <span className="text-gray-600 text-xs mr-3 select-none">
                    {log.timestamp.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span> 
                  {log.message}
                </div>
              ))
            )}
            
            {isLive && !isPaused && (
              <div className="w-2 h-4 bg-neo-green animate-pulse inline-block align-middle ml-1"></div>
            )}
            
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Terminal Footer Status */}
        <div className="bg-neo-black p-1 px-3 text-xs font-mono text-gray-500 flex justify-between border-t border-gray-800">
          <div>
            {logs.length > 0 && <span>LAST_PACKET: {logs[logs.length - 1]?.timestamp.toLocaleTimeString()}</span>}
          </div>
          <div>
            {isLive ? <span className="text-neo-green">● LIVE_STREAM</span> : <span>○ OFFLINE</span>}
          </div>
        </div>

        {/* Paused Overlay */}
        {isPaused && (
          <div className="absolute top-4 right-4 bg-neo-yellow text-black border-2 border-neo-black px-3 py-1 font-bold shadow-neo-sm z-20 animate-pulse">
            PAUSED
          </div>
        )}
      </div>
    </div>
  )
}