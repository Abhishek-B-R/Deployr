"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseBuildLogsProps {
  projectId: string;
  wsUrl?: string;
  active?: boolean;
  onLogsComplete?: (logs: string) => void;
  onReceiveMessage?: () => void;
}

interface LogEntry {
  timestamp: Date;
  message: string;
  type?: "info" | "error" | "warning" | "success";
}

export function useBuildLogs({
  projectId,
  wsUrl = process.env.WEBSOCKET_URL,
  active = true,
  onLogsComplete,
  onReceiveMessage,
}: UseBuildLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const hasReceivedMessageRef = useRef(false);

  const maxReconnectAttempts = 0;

  const formatLogs = useCallback(
    (logEntries: LogEntry[]) => {
      return logEntries
        .map((entry) => `[${entry.timestamp.toISOString()}] ${entry.message}`)
        .join("\n");
    },
    []
  );

  const saveLogs = useCallback(
    async (logEntries: LogEntry[]) => {
      if (logEntries.length === 0) return;

      try {
        const formattedLogs = formatLogs(logEntries);

        const response = await fetch(`/api/projects/${projectId}/logs`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ logs: formattedLogs }),
        });

        if (!response.ok) {
          throw new Error("Failed to save logs");
        }

        console.log("Logs saved to database");
        onLogsComplete?.(formattedLogs);
      } catch (error) {
        console.error("Error saving logs:", error);
      }
    },
    [projectId, formatLogs, onLogsComplete]
  );

  const switchToStored = useCallback(() => {
    console.log("No new logs for 5 seconds, switching to stored logs...");
    setIsLive(false);
    if (logs.length > 0) {
      saveLogs(logs);
    }
  }, [logs, saveLogs]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      switchToStored();
    }, 30000);
  }, [switchToStored]);

  const addLog = useCallback(
    (message: string, type: LogEntry["type"] = "info") => {
      const newLog: LogEntry = {
        timestamp: new Date(),
        message,
        type,
      };

      setLogs((prev) => [...prev, newLog]);

      if (!hasReceivedMessageRef.current) {
        hasReceivedMessageRef.current = true;
        setIsLive(true);
        onReceiveMessage?.();
      }

      resetInactivityTimer();
    },
    [resetInactivityTimer, onReceiveMessage]
  );

  const connectWebSocket = useCallback(() => {
    // Don't connect if not active or already connected
    if (!active || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const ws = new WebSocket(`${wsUrl}?projectId=${projectId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const json = JSON.parse(event.data);
          if (json.projectId === projectId && json.message) {
            addLog(json.message, "info");
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          addLog(event.data);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected", event.code, event.reason);
        setIsConnected(false);

        // Only attempt to reconnect if we're still active
        if (active && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectTimerRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectWebSocket();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Connection error occurred");
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setError("Failed to connect to build logs");
    }
  }, [wsUrl, projectId, addLog, active]);

  const disconnect = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setIsComplete(false);
    setError(null);
    hasReceivedMessageRef.current = false;
    setIsLive(false);
  }, []);

  const retry = useCallback(() => {
    clearLogs();
    reconnectAttemptsRef.current = 0;
    connectWebSocket();
  }, [clearLogs, connectWebSocket]);

  // Effect to handle active toggle and projectId changes
  useEffect(() => {
  if (!active) {
    return;
  }

  // Create WebSocket here without depending on connectWebSocket
  let ws: WebSocket | null = null;
  let reconnectAttempts = 0;
  let reconnectTimer: NodeJS.Timeout | null = null;
  let inactivityTimer: NodeJS.Timeout | null = null;
  let hasReceivedMessage = false;

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(() => {
      console.log("No new logs for 5 seconds, switching to stored logs...");
      setIsLive(false);
      if (logs.length > 0) {
        saveLogs(logs);
      }
    }, 5000);
  };

  const addLogInline = (message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      timestamp: new Date(),
      message,
      type,
    };
    setLogs((prev) => [...prev, newLog]);
    if (!hasReceivedMessage) {
      hasReceivedMessage = true;
      setIsLive(true);
      onReceiveMessage?.();
    }
    resetInactivityTimer();
  };

  const connect = () => {
    ws = new WebSocket(`${wsUrl}?projectId=${projectId}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setError(null);
      reconnectAttempts = 0;
    };

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        if (json.projectId === projectId && json.message) {
          addLogInline(json.message, "info");
        }
      } catch {
        addLogInline(event.data);
      }
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected", event.code, event.reason);
      setIsConnected(false);
      if (active && reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        reconnectTimer = setTimeout(() => {
          connect();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Connection error occurred");
    };
  };

  connect();

  return () => {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (ws) ws.close(1000, "Manual disconnect");
    setIsConnected(false);
  };
}, [active, projectId, wsUrl]);


  return {
    logs,
    isConnected,
    isComplete,
    isLive,
    error,
    addLog,
    clearLogs,
    retry,
    disconnect,
    formattedLogs: formatLogs(logs),
  };
}