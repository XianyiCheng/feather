import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  serverExternalPackages: ["better-sqlite3", "node-pty"],
  // Standalone output bundles a self-contained server for Electron packaging
  output: process.env.ELECTRON_BUILD ? "standalone" : undefined,
};

export default nextConfig;
