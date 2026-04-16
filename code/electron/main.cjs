/**
 * Electron main process.
 *
 * Runs Next.js and the terminal server as child processes on a SEPARATE
 * set of ports from the dev setup (3100/3101/3102) so you can run the
 * app and `npm run dev` at the same time without conflict.
 */
const { app, BrowserWindow, shell } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const net = require("net");
const fs = require("fs");

// Separate ports from dev (3000/3001/3002)
const NEXT_PORT = process.env.EH_NEXT_PORT || "3100";
const TTYD_PORT = process.env.EH_TTYD_PORT || "3101";
const CTRL_PORT = process.env.EH_CTRL_PORT || "3102";
const TMUX_SESSION = "email-helper-app-claude";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const IS_DEV = !app.isPackaged;

let nextProcess = null;
let terminalProcess = null;
let mainWindow = null;

function waitForPort(port, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const sock = new net.Socket();
      sock.setTimeout(500);
      sock.once("connect", () => { sock.destroy(); resolve(); });
      sock.once("error", () => { sock.destroy(); retry(); });
      sock.once("timeout", () => { sock.destroy(); retry(); });
      sock.connect(port, "localhost");
    };
    const retry = () => {
      if (Date.now() - start > timeout) return reject(new Error(`Timeout waiting for port ${port}`));
      setTimeout(check, 200);
    };
    check();
  });
}

function startNext() {
  const cwd = PROJECT_ROOT;

  if (IS_DEV) {
    console.log(`[electron] Starting Next.js dev server on port ${NEXT_PORT}`);
    const p = spawn("npx", ["next", "dev", "-p", NEXT_PORT], {
      cwd,
      env: { ...process.env, PORT: NEXT_PORT },
      stdio: "inherit",
    });
    p.on("exit", (code) => console.log(`[electron] Next.js exited with code ${code}`));
    return p;
  }

  // Packaged app — run the standalone server directly
  const standaloneServer = path.join(cwd, ".next", "standalone", "server.js");
  if (!fs.existsSync(standaloneServer)) {
    console.error(`[electron] Missing standalone server at ${standaloneServer}. Did you run ELECTRON_BUILD=1 next build?`);
    app.quit();
    return null;
  }
  console.log(`[electron] Starting standalone Next.js server on port ${NEXT_PORT}`);
  const p = spawn(process.execPath, [standaloneServer], {
    cwd: path.dirname(standaloneServer),
    env: { ...process.env, PORT: NEXT_PORT, HOSTNAME: "localhost" },
    stdio: "inherit",
  });
  p.on("exit", (code) => console.log(`[electron] Next.js exited with code ${code}`));
  return p;
}

function startTerminalServer() {
  const cwd = PROJECT_ROOT;
  const script = path.join(cwd, "terminal-server.mjs");
  console.log(`[electron] Starting terminal server on ttyd:${TTYD_PORT}, ctrl:${CTRL_PORT}`);
  const p = spawn("node", [script], {
    cwd,
    env: {
      ...process.env,
      TTYD_PORT,
      CTRL_PORT,
      TMUX_SESSION,
    },
    stdio: "inherit",
  });
  p.on("exit", (code) => console.log(`[electron] Terminal server exited with code ${code}`));
  return p;
}

async function createWindow() {
  nextProcess = startNext();
  terminalProcess = startTerminalServer();

  try {
    await waitForPort(NEXT_PORT);
  } catch (e) {
    console.error("[electron] Next.js did not start:", e.message);
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#030712",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // Pass port config to the renderer
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.executeJavaScript(`
      window.__TERMINAL_CONFIG = { ttydPort: ${TTYD_PORT}, ctrlPort: ${CTRL_PORT} };
    `);
  });

  mainWindow.loadURL(`http://localhost:${NEXT_PORT}`);

  // Open external links in the default browser instead of replacing the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://localhost")) return { action: "allow" };
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("before-quit", () => {
  if (nextProcess) { try { nextProcess.kill("SIGTERM"); } catch {} }
  if (terminalProcess) { try { terminalProcess.kill("SIGTERM"); } catch {} }
});
