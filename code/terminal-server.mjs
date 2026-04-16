/**
 * Launches ttyd (terminal-over-websocket) on port 3001 with theme-aware
 * restart support via a control endpoint on port 3002.
 *
 * Requires ttyd installed: `brew install ttyd`
 *
 * Usage: node terminal-server.mjs
 */
import { spawn } from "child_process";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");

const TTYD_PORT = parseInt(process.env.TTYD_PORT || "3001", 10);
const CTRL_PORT = parseInt(process.env.CTRL_PORT || "3002", 10);
const TMUX_SESSION_NAME = process.env.TMUX_SESSION || "email-helper-claude";

const THEMES = {
  dark: {
    background: "#030712",
    foreground: "#e5e7eb",
    cursor: "#e5e7eb",
    selection: "#374151",
  },
  light: {
    background: "#ffffff",
    foreground: "#111827",
    cursor: "#111827",
    selection: "#d1d5db",
  },
};

let ttydProcess = null;
let currentTheme = "dark";

const TMUX_SESSION = TMUX_SESSION_NAME;
const TMUX_CONFIG = resolve(__dirname, "tmux.conf");

function startTtyd(theme) {
  const t = THEMES[theme] || THEMES.dark;
  // `tmux new-session -A` attaches to existing session or creates it if missing.
  // The session runs `claude` in the project root. ttyd restarts keep the session alive.
  // `-f` loads the project's tmux config (mouse scroll, no status bar).
  const tmuxCmd = `tmux -f '${TMUX_CONFIG}' new-session -A -s ${TMUX_SESSION} -c '${PROJECT_ROOT}' 'claude; exec bash'`;
  const args = [
    "-p", String(TTYD_PORT),
    "-W",
    "-t", "fontSize=14",
    "-t", "lineHeight=1.3",
    "-t", `theme=${JSON.stringify(t)}`,
    "-t", "fontFamily=SF Mono, Menlo, Monaco, 'Cascadia Code', 'Courier New', monospace",
    "-t", "disableLeaveAlert=true",
    "bash", "-c", tmuxCmd,
  ];
  console.log(`Starting ttyd with theme=${theme} (tmux session: ${TMUX_SESSION})`);
  const child = spawn("ttyd", args, { stdio: "inherit" });
  child.on("exit", (code) => {
    if (child === ttydProcess) {
      console.log(`ttyd exited (code ${code})`);
      ttydProcess = null;
    }
  });
  return child;
}

function restartTtyd(theme) {
  currentTheme = theme;
  if (ttydProcess) {
    ttydProcess.kill("SIGTERM");
  }
  // Small delay so the port frees up before respawning
  setTimeout(() => {
    ttydProcess = startTtyd(theme);
  }, 200);
}

ttydProcess = startTtyd(currentTheme);

// Control server: POST /theme {theme: "dark"|"light"}
const ctrl = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204); res.end(); return;
  }
  if (req.method === "GET" && req.url === "/theme") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ theme: currentTheme }));
    return;
  }
  if (req.method === "POST" && req.url === "/theme") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        const { theme } = JSON.parse(body || "{}");
        if (theme !== "dark" && theme !== "light") {
          res.writeHead(400); res.end("invalid theme"); return;
        }
        if (theme === currentTheme) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, theme, restarted: false }));
          return;
        }
        restartTtyd(theme);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, theme, restarted: true }));
      } catch (e) {
        res.writeHead(500); res.end(String(e));
      }
    });
    return;
  }
  res.writeHead(404); res.end();
});

ctrl.listen(CTRL_PORT, () => {
  console.log(`Terminal control on http://localhost:${CTRL_PORT}/theme`);
});

process.on("SIGINT", () => {
  if (ttydProcess) ttydProcess.kill("SIGINT");
  ctrl.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  if (ttydProcess) ttydProcess.kill("SIGTERM");
  ctrl.close();
  process.exit(0);
});
