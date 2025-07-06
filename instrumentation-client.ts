import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  // Remove debug mode entirely to fix the bundle warning
  debug: false,
  
  // Simplified integrations for better performance
  integrations: [],
})

// Export router transition hook as required by Sentry
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;