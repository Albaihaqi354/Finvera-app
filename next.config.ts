import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['echarts', 'zrender'],
  // Standalone output bundles only the files needed to run the server.
  // This drastically reduces the Docker image size by skipping the full
  // node_modules copy (~500 MB → ~50 MB in the runner stage).
  output: 'standalone',
};

export default nextConfig;
