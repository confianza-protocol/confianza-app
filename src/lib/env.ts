// Environment variables validation
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const

const optionalEnvVars = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
} as const

// Check for missing required environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    'Please check your .env.local file and ensure all required variables are set.'
  )
}

// Export validated environment variables
export const env = {
  ...requiredEnvVars,
  ...optionalEnvVars,
  NEXT_PUBLIC_SITE_URL: optionalEnvVars.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const 