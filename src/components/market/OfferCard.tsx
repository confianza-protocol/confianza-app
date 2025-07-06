import Link from 'next/link'
import Card from '@/components/ui/Card'
import TrustBadge from '@/components/ui/TrustBadge'
import Button from '@/components/ui/Button'
import StartTradeButton from './StartTradeButton'

interface OfferCardProps {
  offer: {
    id: string
    crypto_asset: string
    fiat_currency: string
    price_per_crypto: number
    min_trade_limit: number
    max_trade_limit: number
    available_amount: number
    created_at: string
    profiles: {
      username: string
      trust_scores: {
        tier: string
        total_trades: number
        successful_trades: number
        positive_feedback: number
        negative_feedback: number
      } | null
    } | null
  }
}

export default function OfferCard({ offer }: OfferCardProps) {
  const trustScore = offer.profiles?.trust_scores
  const successRate = trustScore?.total_trades 
    ? Math.round((trustScore.successful_trades / trustScore.total_trades) * 100)
    : 0

  return (
    <Card hover className="animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold text-lg">
              {offer.profiles?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-text-primary">{offer.profiles?.username || 'Unknown'}</p>
            <TrustBadge tier={trustScore?.tier as any || 'unverified'} />
          </div>
        </div>
        <div className="text-right">
          <p className="body-small">Success Rate</p>
          <p className="font-semibold text-success text-lg">{successRate}%</p>
        </div>
      </div>

      {/* Trading Pair */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="heading-4">
            {offer.crypto_asset} → {offer.fiat_currency}
          </span>
          <span className="heading-4 text-primary">
            {offer.price_per_crypto.toLocaleString()} {offer.fiat_currency}
          </span>
        </div>
        <p className="body-small">per {offer.crypto_asset}</p>
      </div>

      {/* Limits */}
      <div className="mb-6 space-y-3">
        <div className="flex justify-between">
          <span className="body-small">Min Trade:</span>
          <span className="font-medium text-text-primary">{offer.min_trade_limit.toLocaleString()} {offer.fiat_currency}</span>
        </div>
        <div className="flex justify-between">
          <span className="body-small">Max Trade:</span>
          <span className="font-medium text-text-primary">{offer.max_trade_limit.toLocaleString()} {offer.fiat_currency}</span>
        </div>
        <div className="flex justify-between">
          <span className="body-small">Available:</span>
          <span className="font-medium text-text-primary">{offer.available_amount} {offer.crypto_asset}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 p-4 bg-background rounded-button border border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="body-small">Total Trades</p>
            <p className="font-semibold text-text-primary text-lg">{trustScore?.total_trades || 0}</p>
          </div>
          <div>
            <p className="body-small">Positive Reviews</p>
            <p className="font-semibold text-success text-lg">{trustScore?.positive_feedback || 0}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <StartTradeButton offer={offer} />
    </Card>
  )
}