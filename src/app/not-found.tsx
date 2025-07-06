import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex space-x-3">
          <Link
            href="/"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/market"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Browse Market
          </Link>
        </div>
      </div>
    </div>
  )
} 