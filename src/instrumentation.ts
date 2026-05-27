// Sentry initialization is handled by sentry.server.config.ts and sentry.edge.config.ts
// This file is kept for Next.js instrumentation hook compatibility
export async function register() {
  // no-op: @sentry/nextjs v8 auto-initializes via root config files
}
