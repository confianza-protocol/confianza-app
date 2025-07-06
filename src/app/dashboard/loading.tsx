import LoadingSpinner from '@/components/LoadingSpinner'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="mt-2 h-4 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3 flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="mt-1 h-6 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
} 