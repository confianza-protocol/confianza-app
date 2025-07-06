import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Confianza</span>
            </Link>
          </div>

          {/* Navigation Links - Placeholder for future features */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/" 
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-400 px-3 py-2 rounded-md text-sm font-medium">
                Marketplace
              </span>
              <span className="text-gray-400 px-3 py-2 rounded-md text-sm font-medium">
                My Trades
              </span>
            </div>
          </div>

          {/* Auth Buttons - Placeholder */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Sign In
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}