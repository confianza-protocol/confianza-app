'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'
import { logger } from '@/lib/logger'

export default function TestErrorPage() {
  const [errorType, setErrorType] = useState<string>('')

  const throwClientError = () => {
    logger.error('Test client error triggered')
    throw new Error('This is a test client-side error for Sentry')
  }

  const throwServerError = async () => {
    logger.error('Test server error triggered')
    try {
      const response = await fetch('/api/test-error')
      if (!response.ok) {
        throw new Error('Server error test failed')
      }
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  }

  const testLogging = () => {
    logger.info('Test info log', { testData: 'info' })
    logger.warn('Test warning log', { testData: 'warning' })
    logger.error('Test error log', new Error('Test error'), { testData: 'error' })
    logger.debug('Test debug log', { testData: 'debug' })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Error Testing & Observability</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sentry Error Testing</h2>
            <div className="space-y-2">
              <button
                onClick={throwClientError}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Throw Client-Side Error
              </button>
              <button
                onClick={throwServerError}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Throw Server-Side Error
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Logging Testing</h2>
            <button
              onClick={testLogging}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Test All Log Levels
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Instructions</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Click the error buttons to test Sentry integration</li>
              <li>• Check your browser console for log outputs</li>
              <li>• Verify errors appear in your Sentry dashboard</li>
              <li>• Check Supabase logs for structured logging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}