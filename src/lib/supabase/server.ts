import { createServerClient } from '@supabase/ssr'
import { type CookieOptions, type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export function createClient(cookieStore: {
  getAll: () => { name: string; value: string }[]
  setAll: (cookiesToSet: Array<{
    name: string
    value: string
    options?: Partial<CookieOptions>
  }>) => void
}) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookieStore.setAll(cookiesToSet)
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}