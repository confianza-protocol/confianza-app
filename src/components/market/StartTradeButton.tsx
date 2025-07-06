'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'

interface StartTradeButtonProps {
  offer: {
    id: string
    user_id: string
    crypto_asset: string
    fiat_currency: string
    price_per_crypto: number
    min_trade_limit: number
    max_trade_limit: number
    available_amount: number
  }
}

export default function StartTradeButton({ offer }: StartTradeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [tradeAmount, setTradeAmount] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleStartTrade = async () => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      if (user.id === offer.user_id) {
        setError('You cannot trade with your own offer')
        return
      }

      const amount = parseFloat(tradeAmount)
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount')
        return
      }

      if (amount < offer.min_trade_limit || amount > offer.max_trade_limit) {
        setError(`Amount must be between ${offer.min_trade_limit} and ${offer.max_trade_limit} ${offer.fiat_currency}`)
        return
      }

      const cryptoAmount = amount / offer.price_per_crypto
      if (cryptoAmount > offer.available_amount) {
        setError('Insufficient crypto available for this trade amount')
        return
      }

      // Create the trade
      const { data: trade, error: tradeError } = await supabase
        .from('trades')
        .insert({
          offer_id: offer.id,
          buyer_id: user.id,
          seller_id: offer.user_id,
          status: 'pending',
          crypto_amount: cryptoAmount,
          fiat_amount: amount,
          fee_amount_usd: 0, // No fees in testnet
          escrow_contract_address: `0x${Math.random().toString(16).substr(2, 40)}` // Mock address
        })
        .select()
        .single()

      if (tradeError) {
        logger.error('Failed to create trade', tradeError, {
          offerId: offer.id,
          userId: user.id,
          amount
        })
        setError('Failed to create trade. Please try again.')
        return
      }

      logger.info('Trade created successfully', {
        tradeId: trade.id,
        offerId: offer.id,
        buyerId: user.id,
        sellerId: offer.user_id,
        amount
      })

      // Redirect to the live trade page
      router.push(`/trade/${trade.id}`)

    } catch (err) {
      logger.error('Unexpected error creating trade', err as Error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
      >
        Start Trade
      </button>

      {/* Trade Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Start Trade</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trade Amount ({offer.fiat_currency})
                </label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  min={offer.min_trade_limit}
                  max={offer.max_trade_limit}
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Min: ${offer.min_trade_limit}, Max: ${offer.max_trade_limit}`}
                />
              </div>

              {tradeAmount && !isNaN(parseFloat(tradeAmount)) && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    You will receive: <strong>{(parseFloat(tradeAmount) / offer.price_per_crypto).toFixed(8)} {offer.crypto_asset}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Rate: {offer.price_per_crypto.toLocaleString()} {offer.fiat_currency} per {offer.crypto_asset}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartTrade}
                  disabled={loading || !tradeAmount}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Trade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}