// sentry.client.config.js
// This file runs in the browser (client side).
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful Sentry information to the console
  debug: false,

  // Replay is only available in the browser
  integrations: [
    Sentry.replayIntegration({
      // Mask all text content and inputs to protect user privacy
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Capture 10% of sessions in production for performance monitoring
  replaysSessionSampleRate: 0.1,
  // Capture 100% of sessions with errors
  replaysOnErrorSampleRate: 1.0,
});
