import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The native SQLite driver must not be bundled by webpack.
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
};

export default nextConfig;
