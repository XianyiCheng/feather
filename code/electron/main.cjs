/**
 * Electron main process.
 *
 * Runs Next.js and the terminal server as child processes on a SEPARATE
 * set of ports from the dev setup (3100/3101/3102) so you can run the
 * app and `npm run dev` at the same time without conflict.
 *
 * On first launch, if no OAuth credentials are stored, shows an onboarding
 * window that walks the user through creating their own Google OAuth client
 * and stores the credentials in <userData>/credentials.json.
 */
const { app, BrowserWindow, shell, ipcMain, globalShortcut } = require("electron");
const { spawn } = require("child_process");
const crypto = require("crypto");
const path = require("path");
const net = require("net");
const fs = require("fs");

// Separate ports from dev (3000/3001/3002)
const NEXT_PORT = process.env.EH_NEXT_PORT || "3100";
const TTYD_PORT = process.env.EH_TTYD_PORT || "3101";
const CTRL_PORT = process.env.EH_CTRL_PORT || "3102";
const TMUX_SESSION = "email-helper-app-claude";

const IS_DEV = !app.isPackaged;
// In dev: project root is one level up from electron/
// In packaged: resources are in app.asar.unpacked (for spawnable files)
const PROJECT_ROOT = IS_DEV
  ? path.resolve(__dirname, "..")
  : path.join(process.resourcesPath, "app.asar.unpacked");

let nextProcess = null;
let terminalProcess = null;
let mainWindow = null;
let onboardingWindow = null;

function credentialsPath() {
  return path.join(app.getPath("userData"), "credentials.json");
}

function loadCredentials() {
  const p = credentialsPath();
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, "utf8"));
      if (data.clientId && data.clientSecret && data.nextauthSecret) return data;
    } catch (e) {
      console.error("[electron] Failed to parse credentials.json:", e.message);
    }
  }

  // Dev fallback: read from .env.local so `npm run electron:dev` works
  // with the dev setup's existing credentials.
  if (IS_DEV) {
    const envFile = path.join(PROJECT_ROOT, ".env.local");
    if (fs.existsSync(envFile)) {
      const env = {};
      for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
        const m = line.match(/^([A-Z_]+)=["']?(.*?)["']?$/);
        if (m) env[m[1]] = m[2];
      }
      if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
        return {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          nextauthSecret: env.NEXTAUTH_SECRET || crypto.randomBytes(32).toString("base64"),
        };
      }
    }
  }
  return null;
}

function saveCredentials({ clientId, clientSecret }) {
  const data = {
    clientId,
    clientSecret,
    nextauthSecret: crypto.randomBytes(32).toString("base64"),
  };
  const p = credentialsPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), { mode: 0o600 });
  return data;
}

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

function startNext(creds) {
  const cwd = PROJECT_ROOT;
  const env = {
    ...process.env,
    PORT: NEXT_PORT,
    GOOGLE_CLIENT_ID: creds.clientId,
    GOOGLE_CLIENT_SECRET: creds.clientSecret,
    NEXTAUTH_URL: `http://localhost:${NEXT_PORT}`,
    NEXTAUTH_SECRET: creds.nextauthSecret,
  };

  if (IS_DEV) {
    console.log(`[electron] Starting Next.js dev server on port ${NEXT_PORT}`);
    const p = spawn("npx", ["next", "dev", "-p", NEXT_PORT], {
      cwd,
      env: { ...env, NEXT_DIST_DIR: ".next-electron" },
      stdio: "inherit",
    });
    p.on("exit", (code) => console.log(`[electron] Next.js exited with code ${code}`));
    return p;
  }

  // In packaged mode, the standalone server is in the unpacked asar.
  // The asar root has the full project, unpacked root has spawnable files.
  const asarRoot = path.join(process.resourcesPath, "app.asar");
  const standaloneDir = path.join(PROJECT_ROOT, ".next", "standalone");
  const standaloneServer = path.join(standaloneDir, "server.js");
  if (!fs.existsSync(standaloneServer)) {
    console.error(`[electron] Missing standalone server at ${standaloneServer}.`);
    console.error("[electron] Available files:", fs.readdirSync(PROJECT_ROOT).join(", "));
    app.quit();
    return null;
  }

  // Ensure prisma DB directory exists in user data (persistent across updates)
  const userDataDir = app.getPath("userData");
  const dbPath = path.join(userDataDir, "dev.db");
  env.DATABASE_URL = `file:${dbPath}`;

  console.log(`[electron] Starting standalone Next.js server on port ${NEXT_PORT}`);
  const p = spawn(process.execPath, [standaloneServer], {
    cwd: standaloneDir,
    env: { ...env, HOSTNAME: "localhost" },
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

function showOnboarding() {
  onboardingWindow = new BrowserWindow({
    width: 800,
    height: 800,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#0c0a09",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });
  onboardingWindow.loadFile(path.join(__dirname, "onboarding.html"));
  onboardingWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

async function startMainApp(creds) {
  nextProcess = startNext(creds);
  terminalProcess = startTerminalServer();

  try {
    await waitForPort(NEXT_PORT);
  } catch (e) {
    console.error("[electron] Next.js did not start:", e.message);
  }

  mainWindow = new BrowserWindow({
    title: "feather",
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#0c0a09",
    icon: path.join(__dirname, "icon.icns"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.executeJavaScript(`
      window.__TERMINAL_CONFIG = { ttydPort: ${TTYD_PORT}, ctrlPort: ${CTRL_PORT} };
    `);
  });

  // Ctrl+Tab: cycle focus between panels (threads → email → terminal).
  // globalShortcut works even when iframe has focus (before-input-event doesn't fire for Ctrl+Tab).
  globalShortcut.register("Ctrl+Tab", () => {
    if (mainWindow && mainWindow.isFocused()) {
      mainWindow.webContents.executeJavaScript(`
        window.dispatchEvent(new CustomEvent('cycle-panel'));
      `);
    }
  });

  mainWindow.on("closed", () => {
    globalShortcut.unregister("Ctrl+Tab");
  });

  mainWindow.loadURL(`http://localhost:${NEXT_PORT}`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://localhost")) return { action: "allow" };
    shell.openExternal(url);
    return { action: "deny" };
  });
}

function boot() {
  const creds = loadCredentials();
  if (!creds) {
    showOnboarding();
  } else {
    startMainApp(creds);
  }
}

// IPC: onboarding form submits credentials
ipcMain.handle("save-credentials", async (_event, { clientId, clientSecret }) => {
  const creds = saveCredentials({ clientId, clientSecret });
  if (onboardingWindow) {
    onboardingWindow.close();
    onboardingWindow = null;
  }
  await startMainApp(creds);
  return { ok: true };
});

app.whenReady().then(boot);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) boot();
});

app.on("before-quit", () => {
  if (nextProcess) { try { nextProcess.kill("SIGTERM"); } catch {} }
  if (terminalProcess) { try { terminalProcess.kill("SIGTERM"); } catch {} }
});
