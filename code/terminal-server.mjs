/**
 * Standalone WebSocket server that bridges browser xterm.js to a local PTY.
 * Runs on port 3001 alongside the Next.js app on port 3000.
 *
 * Usage: node terminal-server.mjs
 */
import { WebSocketServer } from "ws";
import pty from "node-pty";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

console.log(`Terminal WebSocket server listening on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  console.log("Terminal client connected");

  const shell = process.env.SHELL || "/bin/bash";

  // Spawn a PTY that starts claude in the project root
  const ptyProcess = pty.spawn(shell, ["-l"], {
    name: "xterm-256color",
    cols: 120,
    rows: 30,
    cwd: PROJECT_ROOT,
    env: { ...process.env, TERM: "xterm-256color" },
  });

  // Send initial command to start claude
  setTimeout(() => {
    ptyProcess.write("claude\r");
  }, 500);

  // PTY → Browser
  ptyProcess.onData((data) => {
    try {
      ws.send(data);
    } catch {
      // Client disconnected
    }
  });

  // Browser → PTY
  ws.on("message", (msg) => {
    const data = msg.toString();
    try {
      // Handle resize messages
      const parsed = JSON.parse(data);
      if (parsed.type === "resize" && parsed.cols && parsed.rows) {
        ptyProcess.resize(parsed.cols, parsed.rows);
        return;
      }
    } catch {
      // Not JSON — regular terminal input
    }
    ptyProcess.write(data);
  });

  ws.on("close", () => {
    console.log("Terminal client disconnected");
    ptyProcess.kill();
  });

  ptyProcess.onExit(() => {
    console.log("PTY process exited");
    try {
      ws.close();
    } catch {
      // Already closed
    }
  });
});
