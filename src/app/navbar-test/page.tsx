import Link from 'next/link'

export default function NavbarTestPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Navigation Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Test Navigation Links</h2>
            <div className="space-y-2">
              <Link
                href="/test-error"
                className="block w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center"
              >
                Test Error Handling & Observability
              </Link>
              <Link
                href="/market"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center"
              >
                Browse Market (Start Trades)
              </Link>
              <Link
                href="/dashboard"
                className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center"
              >
                Dashboard (View Trades)
              </Link>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Live Trade Features</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Real-time trade status updates via Supabase subscriptions</li>
              <li>• State machine-driven UI that adapts to trade status</li>
              <li>• Interactive buttons for trade progression</li>
              <li>• Dispute reporting functionality</li>
              <li>• Comprehensive error handling and logging</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Observability Features</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Sentry integration for error tracking</li>
              <li>• Structured logging with context</li>
              <li>• Real-time connection status monitoring</li>
              <li>• Trade lifecycle event logging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}