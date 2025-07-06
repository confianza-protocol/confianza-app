import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Confianza - Safe P2P Crypto Trading',
  description: 'The safest way to buy and sell crypto in Latin America. Building a community of trust through on-chain reputation.',
  keywords: ['crypto', 'P2P', 'Latin America', 'blockchain', 'trust', 'trading'],
  authors: [{ name: 'Confianza Protocol' }],
  openGraph: {
    title: 'Confianza - Safe P2P Crypto Trading',
    description: 'The safest way to buy and sell crypto in Latin America.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}