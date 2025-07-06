import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import Button from '@/components/ui/Button'
import AuthButton from '@/components/auth/AuthButton'

interface NavbarProps {
  user: User | null
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container-main">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-text-primary group-hover:text-primary transition-colors duration-200">
                Confianza
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/" 
                className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-button text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/market"
                className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-button text-sm font-medium transition-colors duration-200"
              >
                Marketplace
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-button text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <AuthButton user={user} />
        </div>
      </div>
    </nav>
  )
}