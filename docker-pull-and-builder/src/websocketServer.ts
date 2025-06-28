import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8082 });

export const clients = new Map<string, Set<WebSocket>>();

// This holds buffered logs per projectId
export const projectLogsBuffer = new Map<string, string[]>();

wss.on("connection", (ws, req) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const projectId = url.searchParams.get("projectId");

  if (!projectId) {
    ws.close(1008, "Missing projectId");
    return;
  }

  // Add client to clients map
  if (!clients.has(projectId)) {
    clients.set(projectId, new Set());
  }
  clients.get(projectId)!.add(ws);

  console.log(`[WebSocket] Client connected for projectId=${projectId}`);

  // Send buffered logs to new client
  const buffer = projectLogsBuffer.get(projectId);
  if (buffer && buffer.length > 0) {
    console.log(`[WebSocket] Replaying ${buffer.length} buffered logs to new client`);
    for (const msg of buffer) {
      ws.send(JSON.stringify({ projectId, message: msg }));
    }
  }

  ws.on("close", () => {
    console.log(`[WebSocket] Client disconnected for projectId=${projectId}`);
    if (clients.has(projectId)) {
      clients.get(projectId)!.delete(ws);
      if (clients.get(projectId)!.size === 0) {
        clients.delete(projectId);
      }
    }
  });
});

/**
 * Broadcasts a log message to all connected clients
 * and stores it in the buffer for future subscribers.
 */
export function broadcastLog(projectId: string, message: string) {
  console.log(`[broadcastLog] For projectId=${projectId}: ${message}`);

  // Save to buffer
  if (!projectLogsBuffer.has(projectId)) {
    projectLogsBuffer.set(projectId, []);
  }
  projectLogsBuffer.get(projectId)!.push(message);

  // Limit buffer size if you want (e.g., max 500 messages)
  const buffer = projectLogsBuffer.get(projectId)!;
  if (buffer.length > 500) {
    buffer.splice(0, buffer.length - 500);
  }

  // Send to connected clients
  const projectClients = clients.get(projectId);
  if (!projectClients) {
    console.log(`[broadcastLog] No clients connected for projectId=${projectId}`);
    return;
  }

  for (const client of projectClients) {
    if (client.readyState === client.OPEN) {
      console.log(`[broadcastLog] Sending to client`);
      client.send(JSON.stringify({ projectId, message }));
    } else {
      console.log(`[broadcastLog] Skipped client with readyState=${client.readyState}`);
    }
  }
}
