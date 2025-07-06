import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutContent from '@/components/LayoutContent'
import ErrorBoundary from '@/components/ErrorBoundary'
import * as Sentry from '@sentry/nextjs'

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export function generateMetadata(): Metadata {
  return {
    title: 'Confianza - Safe P2P Crypto Trading',
    description: 'The safest way to buy and sell crypto in Latin America. Building a community of trust through on-chain reputation.',
    keywords: ['crypto', 'P2P', 'Latin America', 'blockchain', 'trust', 'trading'],
    authors: [{ name: 'Confianza Protocol' }],
    openGraph: {
      title: 'Confianza - Safe P2P Crypto Trading',
      description: 'The safest way to buy and sell crypto in Latin America.',
      type: 'website',
    },
    other: {
      ...Sentry.getTraceData()
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ErrorBoundary>
          <LayoutContent>
            {children}
          </LayoutContent>
        </ErrorBoundary>
      </body>
    </html>
  )
}