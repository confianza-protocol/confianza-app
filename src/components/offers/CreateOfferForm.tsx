'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreateOfferForm() {
  const [formData, setFormData] = useState({
    crypto_asset: 'USDC',
    fiat_currency: 'CRC',
    price_per_crypto: '',
    min_trade_limit: '',
    max_trade_limit: '',
    available_amount: '',
    payment_method: 'bank_transfer',
    payment_details: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('You must be logged in to create an offer')
        return
      }

      const { error: insertError } = await supabase
        .from('offers')
        .insert({
          user_id: user.id,
          crypto_asset: formData.crypto_asset,
          fiat_currency: formData.fiat_currency,
          price_per_crypto: parseFloat(formData.price_per_crypto),
          min_trade_limit: parseFloat(formData.min_trade_limit),
          max_trade_limit: parseFloat(formData.max_trade_limit),
          available_amount: parseFloat(formData.available_amount),
          payment_method_details: {
            method: formData.payment_method,
            details: formData.payment_details
          }
        })

      if (insertError) {
        setError(insertError.message)
      } else {
        router.push('/market')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Trading Pair */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crypto Asset
          </label>
          <select
            name="crypto_asset"
            value={formData.crypto_asset}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
            <option value="ETH">ETH</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fiat Currency
          </label>
          <select
            name="fiat_currency"
            value={formData.fiat_currency}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CRC">CRC (Costa Rica)</option>
            <option value="USD">USD</option>
            <option value="MXN">MXN (Mexico)</option>
            <option value="GTQ">GTQ (Guatemala)</option>
            <option value="HNL">HNL (Honduras)</option>
          </select>
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price per {formData.crypto_asset} (in {formData.fiat_currency})
        </label>
        <input
          type="number"
          name="price_per_crypto"
          value={formData.price_per_crypto}
          onChange={handleChange}
          step="0.01"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter price"
        />
      </div>

      {/* Trade Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Trade Limit ({formData.fiat_currency})
          </label>
          <input
            type="number"
            name="min_trade_limit"
            value={formData.min_trade_limit}
            onChange={handleChange}
            step="0.01"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Minimum amount"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Trade Limit ({formData.fiat_currency})
          </label>
          <input
            type="number"
            name="max_trade_limit"
            value={formData.max_trade_limit}
            onChange={handleChange}
            step="0.01"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Maximum amount"
          />
        </div>
      </div>

      {/* Available Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Amount ({formData.crypto_asset})
        </label>
        <input
          type="number"
          name="available_amount"
          value={formData.available_amount}
          onChange={handleChange}
          step="0.00000001"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Amount available for trading"
        />
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="bank_transfer">Bank Transfer</option>
          <option value="mobile_money">Mobile Money</option>
          <option value="cash">Cash</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      {/* Payment Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Details
        </label>
        <textarea
          name="payment_details"
          value={formData.payment_details}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Provide payment instructions or account details..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Offer'}
        </button>
      </div>
    </form>
  )
}