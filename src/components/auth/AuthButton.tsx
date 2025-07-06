'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import Button from '@/components/ui/Button'

interface AuthButtonProps {
  user: User | null
}

export default function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/login">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </Link>
      <Link href="/signup">
        <Button variant="primary" size="sm">
          Get Started
        </Button>
      </Link>
    </div>
  )
}