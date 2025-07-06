import * as Sentry from '@sentry/nextjs'

interface LogEvent {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  metadata?: Record<string, any>
  userId?: string
  tradeId?: string
  timestamp?: string
}

export class Logger {
  private static instance: Logger
  
  private constructor() {}
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }
  
  private formatLog(event: LogEvent): LogEvent {
    return {
      ...event,
      timestamp: new Date().toISOString(),
    }
  }
  
  info(message: string, metadata?: Record<string, any>, context?: { userId?: string; tradeId?: string }) {
    const logEvent = this.formatLog({
      level: 'info',
      message,
      metadata,
      ...context,
    })
    
    console.log('[INFO]', logEvent)
    this.sendToLogflare(logEvent)
  }
  
  warn(message: string, metadata?: Record<string, any>, context?: { userId?: string; tradeId?: string }) {
    const logEvent = this.formatLog({
      level: 'warn',
      message,
      metadata,
      ...context,
    })
    
    console.warn('[WARN]', logEvent)
    this.sendToLogflare(logEvent)
  }
  
  error(message: string, error?: Error, metadata?: Record<string, any>, context?: { userId?: string; tradeId?: string }) {
    const logEvent = this.formatLog({
      level: 'error',
      message,
      metadata: {
        ...metadata,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : undefined,
      },
      ...context,
    })
    
    console.error('[ERROR]', logEvent)
    
    // Only capture exceptions to Sentry (crucial part)
    if (error) {
      Sentry.captureException(error, {
        extra: { ...logEvent, metadata },
      })
    }
    
    this.sendToLogflare(logEvent)
  }
  
  debug(message: string, metadata?: Record<string, any>, context?: { userId?: string; tradeId?: string }) {
    if (process.env.NODE_ENV === 'development') {
      const logEvent = this.formatLog({
        level: 'debug',
        message,
        metadata,
        ...context,
      })
      
      console.debug('[DEBUG]', logEvent)
      this.sendToLogflare(logEvent)
    }
  }
  
  private async sendToLogflare(event: LogEvent) {
    try {
      // In a real implementation, you would send to Logflare via Supabase
      // For now, we'll just structure the logs properly
      if (typeof window === 'undefined') {
        // Server-side logging could be sent to Supabase edge functions
        // that forward to Logflare
      }
    } catch (error) {
      console.error('Failed to send log to Logflare:', error)
    }
  }
}

export const logger = Logger.getInstance()