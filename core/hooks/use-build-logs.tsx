"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseBuildLogsProps {
  projectId: string
  wsUrl?: string
  onLogsComplete?: (logs: string) => void
}

interface LogEntry {
  timestamp: Date
  message: string
  type?: "info" | "error" | "warning" | "success"
}

export function useBuildLogs({ projectId, wsUrl = "ws://localhost:3001", onLogsComplete }: UseBuildLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const formatLogs = useCallback((logEntries: LogEntry[]) => {
    return logEntries.map((entry) => `[${entry.timestamp.toISOString()}] ${entry.message}`).join("\n")
  }, [])

  const saveLogs = useCallback(
    async (logEntries: LogEntry[]) => {
      if (logEntries.length === 0) return

      try {
        const formattedLogs = formatLogs(logEntries)

        const response = await fetch(`/api/projects/${projectId}/logs`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ logs: formattedLogs }),
        })

        if (!response.ok) {
          throw new Error("Failed to save logs")
        }

        console.log("Logs saved to database")
        onLogsComplete?.(formattedLogs)
      } catch (error) {
        console.error("Error saving logs:", error)
      }
    },
    [projectId, formatLogs, onLogsComplete],
  )

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    inactivityTimerRef.current = setTimeout(() => {
      console.log("No new logs for 10 seconds, saving to database...")
      setIsComplete(true)
      saveLogs(logs)

      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close()
      }
    }, 10000) // 10 seconds
  }, [logs, saveLogs])

  const addLog = useCallback(
    (message: string, type: LogEntry["type"] = "info") => {
      const newLog: LogEntry = {
        timestamp: new Date(),
        message,
        type,
      }

      setLogs((prev) => [...prev, newLog])
      resetInactivityTimer()
    },
    [resetInactivityTimer],
  )

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const ws = new WebSocket(`${wsUrl}?projectId=${projectId}`)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("WebSocket connected")
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0

        // Send initial message to start receiving logs for this project
        ws.send(
          JSON.stringify({
            type: "subscribe",
            projectId,
          }),
        )
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === "log") {
            addLog(data.message, data.logType || "info")
          } else if (data.type === "complete") {
            console.log("Build completed, saving logs...")
            setIsComplete(true)
            saveLogs(logs)
          } else if (data.type === "error") {
            addLog(`Error: ${data.message}`, "error")
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // If it's not JSON, treat as plain log message
          addLog(event.data)
        }
      }

      ws.onclose = (event) => {
        console.log("WebSocket disconnected", event.code, event.reason)
        setIsConnected(false)

        // Only attempt reconnection if it wasn't a normal closure and we haven't exceeded max attempts
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts && !isComplete) {
          reconnectAttemptsRef.current++
          console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)

          reconnectTimerRef.current = setTimeout(() => {
            connectWebSocket()
          }, Math.pow(2, reconnectAttemptsRef.current) * 1000) // Exponential backoff
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setError("Connection error occurred")
      }
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      setError("Failed to connect to build logs")
    }
  }, [wsUrl, projectId, addLog, isComplete, logs, saveLogs])

  const disconnect = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect")
    }

    setIsConnected(false)
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
    setIsComplete(false)
    setError(null)
  }, [])

  const retry = useCallback(() => {
    clearLogs()
    reconnectAttemptsRef.current = 0
    connectWebSocket()
  }, [clearLogs, connectWebSocket])

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket()

    return () => {
      disconnect()
    }
  }, [connectWebSocket, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }
    }
  }, [])

  return {
    logs,
    isConnected,
    isComplete,
    error,
    addLog,
    clearLogs,
    retry,
    disconnect,
    formattedLogs: formatLogs(logs),
  }
}
