import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  transpilePackages: ['echarts', 'zrender'],
  // Standalone output bundles only the files needed to run the server.
  // This drastically reduces the Docker image size by skipping the full
  // node_modules copy (~500 MB → ~50 MB in the runner stage).
  output: 'standalone',
};

export default withSentryConfig(nextConfig, {
  // Sentry organization and project (from sentry.io dashboard)
  org: "finvera",
  project: "finvera-app",

  // Suppresses source map uploading logs during build
  silent: !process.env.CI,

  // Upload source maps to Sentry so stack traces are readable
  widenClientFileUpload: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors
  automaticVercelMonitors: true,
});
