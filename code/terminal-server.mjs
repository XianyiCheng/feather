/**
 * Launches ttyd (a mature terminal-over-websocket server) on port 3001.
 * The frontend embeds this in an iframe — ttyd handles all PTY plumbing.
 *
 * Requires ttyd installed: `brew install ttyd`
 *
 * Usage: node terminal-server.mjs
 */
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");

const PORT = 3001;

// ttyd args:
//   -p 3001          listen on port 3001
//   -W               allow write (client can type)
//   --writable       same as -W on newer versions
//   -t               theme/options
//   bash -c "..."    command to run — cd to project root, then claude
const args = [
  "-p", String(PORT),
  "-W",
  "-t", "fontSize=13",
  "-t", "theme={\"background\":\"#030712\",\"foreground\":\"#e5e7eb\",\"cursor\":\"#e5e7eb\"}",
  "-t", "fontFamily=Menlo, Monaco, 'Courier New', monospace",
  "-t", "disableLeaveAlert=true",
  "bash", "-c", `cd '${PROJECT_ROOT}' && claude; exec bash`,
];

console.log(`Starting ttyd on http://localhost:${PORT}`);
console.log(`Project root: ${PROJECT_ROOT}`);

const child = spawn("ttyd", args, { stdio: "inherit" });

child.on("exit", (code) => {
  console.log(`ttyd exited with code ${code}`);
  process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
