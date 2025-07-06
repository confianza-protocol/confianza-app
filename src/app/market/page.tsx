import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import OfferCard from '@/components/market/OfferCard'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Market - Confianza',
  description: 'Browse crypto trading offers',
}

export default async function MarketPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // Fetch active offers with seller profile and trust score
  const { data: offers, error } = await supabase
    .from('offers')
    .select(`
      *,
      profiles!offers_user_id_fkey (
        username,
        trust_scores (
          tier,
          total_trades,
          successful_trades,
          positive_feedback,
          negative_feedback
        )
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    // Error fetching offers - handle gracefully
  }

  return (
    <div className="container-main py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-in">
        <div>
          <h1 className="heading-1">Marketplace</h1>
          <p className="mt-2 body-large text-text-secondary">
            Browse active crypto trading offers from verified users
          </p>
        </div>
        <Link href="/offers/create" className="mt-4 sm:mt-0">
          <Button size="lg">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Offer
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-8 animate-slide-up" padding="lg">
        <h2 className="heading-3 mb-6">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="input-label">Currency</label>
            <select className="input">
              <option value="">All Currencies</option>
              <option value="CRC">CRC (Costa Rica)</option>
              <option value="USD">USD</option>
              <option value="MXN">MXN (Mexico)</option>
            </select>
          </div>
          <div>
            <label className="input-label">Crypto Asset</label>
            <select className="input">
              <option value="">All Assets</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
          <div>
            <label className="input-label">Trust Level</label>
            <select className="input">
              <option value="">All Levels</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
          </div>
          <div>
            <label className="input-label">Amount Range</label>
            <select className="input">
              <option value="">Any Amount</option>
              <option value="0-100">$0 - $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500+">$500+</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Offers Grid */}
      {offers && offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-in">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="heading-3 mb-2">No offers available</h3>
          <p className="body text-text-secondary mb-6">
            Be the first to create a trading offer!
          </p>
          <Link href="/offers/create">
            <Button size="lg">
              Create Offer
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}