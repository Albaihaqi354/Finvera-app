// sentry.server.config.js
// This file runs on the server (Node.js / Vercel serverless).
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 1.0,

  // Setting this option to true will print useful Sentry information to the console
  debug: false,
});
