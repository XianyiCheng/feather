import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  serverExternalPackages: ["better-sqlite3", "node-pty"],
};

export default nextConfig;
