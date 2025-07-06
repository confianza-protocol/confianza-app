import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    logger.error('Test server error endpoint called')
    throw new Error('This is a test server-side error for Sentry')
  } catch (error) {
    logger.error('Server error occurred', error as Error)
    return NextResponse.json({ error: 'Test server error' }, { status: 500 })
  }
}