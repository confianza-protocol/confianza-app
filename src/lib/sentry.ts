import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    debug: process.env.NODE_ENV === 'development',
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', /^https:\/\/yourapp\.vercel\.app/],
      }),
    ],
  })
}

export { Sentry }