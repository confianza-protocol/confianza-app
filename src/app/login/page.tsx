import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import Card from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Login - Confianza',
  description: 'Sign in to your Confianza account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-in">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
          </div>
          <h2 className="mt-6 heading-2 text-center">
            Welcome Back
          </h2>
          <p className="mt-2 body-small text-center">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-primary hover:text-primary-hover transition-colors duration-200"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <Card padding="lg" className="animate-slide-up">
          <LoginForm />
        </Card>
      </div>
    </div>
  )
}