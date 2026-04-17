import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  serverExternalPackages: ["better-sqlite3", "node-pty"],
  // Standalone output bundles a self-contained server for Electron packaging
  output: process.env.ELECTRON_BUILD ? "standalone" : undefined,
  // Separate build directory for Electron so it can run alongside `next dev`
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
