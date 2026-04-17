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

const IS_PACKAGED = app.isPackaged;
const IS_PROD_TEST = !!process.env.ELECTRON_PROD_TEST; // test standalone without packaging
const IS_DEV = !IS_PACKAGED && !IS_PROD_TEST;

// In dev: project root is one level up from electron/
// In prod-test: same as dev, but uses standalone server
// In packaged: resources are in app.asar.unpacked (for spawnable files)
const PROJECT_ROOT = IS_PACKAGED
  ? path.join(process.resourcesPath, "app.asar.unpacked")
  : path.resolve(__dirname, "..");

console.log(`[electron] mode=${IS_DEV ? "dev" : IS_PROD_TEST ? "prod-test" : "packaged"} root=${PROJECT_ROOT}`);

let nextProcess = null;
let terminalProcess = null;
let mainWindow = null;
let onboardingWindow = null;

// In packaged mode, log to a file since there's no console
const logFile = IS_PACKAGED
  ? fs.createWriteStream(path.join(app.getPath("userData"), "feather.log"), { flags: "w" })
  : null;
const _log = console.log;
const _err = console.error;
if (logFile) {
  console.log = (...args) => { logFile.write(args.join(" ") + "\n"); _log(...args); };
  console.error = (...args) => { logFile.write("[ERR] " + args.join(" ") + "\n"); _err(...args); };
  process.on("uncaughtException", (e) => { logFile.write("[CRASH] " + e.stack + "\n"); logFile.end(); });
}

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

  // Dev/prod-test fallback: read from .env.local
  if (IS_DEV || IS_PROD_TEST) {
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
    AUTH_TRUST_HOST: "true",
  };

  if (IS_DEV) {
    // Clean up stale lock from previous crash
    const lockPath = path.join(cwd, ".next-electron", "dev", "lock");
    try { fs.unlinkSync(lockPath); } catch {}

    console.log(`[electron] Starting Next.js dev server on port ${NEXT_PORT}`);
    const nextBin = path.join(cwd, "node_modules", ".bin", "next");
    const cmd = `exec "${nextBin}" dev -p ${NEXT_PORT}`;
    const p = spawn("bash", ["-c", cmd], {
      cwd,
      env: { ...env, NEXT_DIST_DIR: ".next-electron" },
      stdio: "inherit",
    });
    p.on("exit", (code, signal) => console.log(`[electron] Next.js exited code=${code} signal=${signal}`));
    return p;
  }

  // Production / prod-test: use the standalone server
  const standaloneDir = path.join(PROJECT_ROOT, ".next", "standalone");
  const standaloneServer = path.join(standaloneDir, "server.js");
  console.log(`[electron] Looking for standalone server at: ${standaloneServer}`);
  if (!fs.existsSync(standaloneServer)) {
    console.error(`[electron] MISSING standalone server at ${standaloneServer}`);
    try {
      console.error("[electron] PROJECT_ROOT contents:", fs.readdirSync(PROJECT_ROOT).join(", "));
    } catch (e) { console.error("[electron] Cannot read PROJECT_ROOT:", e.message); }
    app.quit();
    return null;
  }

  // Persistent DB in user data
  const userDataDir = app.getPath("userData");
  const dbPath = path.join(userDataDir, "dev.db");
  env.DATABASE_URL = `file:${dbPath}`;

  console.log(`[electron] Starting standalone Next.js on port ${NEXT_PORT} (cwd: ${standaloneDir})`);
  const p = spawn(process.execPath, [standaloneServer], {
    cwd: standaloneDir,
    env: { ...env, HOSTNAME: "localhost" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  p.stdout.on("data", (d) => process.stdout.write(`[next] ${d}`));
  p.stderr.on("data", (d) => process.stderr.write(`[next:err] ${d}`));
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
  console.log("[electron] showOnboarding() called");
  const htmlPath = path.join(__dirname, "onboarding.html");
  const preloadPath = path.join(__dirname, "preload.cjs");
  console.log(`[electron] onboarding html: ${htmlPath}`);
  console.log(`[electron] preload: ${preloadPath}`);
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
  console.log("[electron] Loading onboarding file...");
  onboardingWindow.loadFile(htmlPath).then(() => {
    console.log("[electron] Onboarding loaded successfully");
  }).catch((err) => {
    console.error("[electron] Onboarding load failed:", err);
  });
  onboardingWindow.on("closed", () => { console.log("[electron] Onboarding window closed"); });
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
  console.log(`[electron] boot() — IS_PACKAGED=${IS_PACKAGED} IS_DEV=${IS_DEV} IS_PROD_TEST=${IS_PROD_TEST}`);
  console.log(`[electron] __dirname=${__dirname}`);
  console.log(`[electron] PROJECT_ROOT=${PROJECT_ROOT}`);
  console.log(`[electron] userData=${app.getPath("userData")}`);

  // Set dock icon in dev mode (packaged app uses Info.plist)
  if (!IS_PACKAGED && process.platform === "darwin" && app.dock) {
    const iconPath = path.join(PROJECT_ROOT, "public", "feather.png");
    if (fs.existsSync(iconPath)) {
      const { nativeImage } = require("electron");
      app.dock.setIcon(nativeImage.createFromPath(iconPath));
    }
  }

  const creds = loadCredentials();
  console.log(`[electron] credentials found: ${!!creds}`);
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

// Single instance lock — prevent multiple feather windows
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // Focus existing window when user tries to launch again
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    } else if (onboardingWindow) {
      onboardingWindow.focus();
    }
  });
  app.whenReady().then(boot);
}

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
