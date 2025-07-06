import Link from 'next/link'

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

  const getTrustColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-500'
      case 'silver': return 'bg-gray-400'
      case 'bronze': return 'bg-amber-600'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {offer.profiles?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{offer.profiles?.username || 'Unknown'}</p>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getTrustColor(trustScore?.tier || 'unverified')}`}></div>
              <span className="text-sm text-gray-500 capitalize">{trustScore?.tier || 'Unverified'}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="font-semibold text-green-600">{successRate}%</p>
        </div>
      </div>

      {/* Trading Pair */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {offer.crypto_asset} → {offer.fiat_currency}
          </span>
          <span className="text-lg font-bold text-blue-600">
            {offer.price_per_crypto.toLocaleString()} {offer.fiat_currency}
          </span>
        </div>
        <p className="text-sm text-gray-500">per {offer.crypto_asset}</p>
      </div>

      {/* Limits */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Min Trade:</span>
          <span className="font-medium">{offer.min_trade_limit.toLocaleString()} {offer.fiat_currency}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Max Trade:</span>
          <span className="font-medium">{offer.max_trade_limit.toLocaleString()} {offer.fiat_currency}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Available:</span>
          <span className="font-medium">{offer.available_amount} {offer.crypto_asset}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Total Trades</p>
            <p className="font-semibold">{trustScore?.total_trades || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Positive Reviews</p>
            <p className="font-semibold text-green-600">{trustScore?.positive_feedback || 0}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
        Start Trade
      </button>
    </div>
  )
}