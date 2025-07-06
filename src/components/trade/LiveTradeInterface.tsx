'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TradeStatus } from '@/types/database'
import { getTradeState } from '@/lib/trade-state'
import { logger } from '@/lib/logger'
import { formatDate, formatCurrency } from '@/lib/utils'
import TradeStatusBadge from './TradeStatusBadge'
import TradeProgressSteps from './TradeProgressSteps'
import TradeActions from './TradeActions'
import Link from 'next/link'

interface LiveTradeInterfaceProps {
  trade: any // Full trade object with relations
  userRole: 'buyer' | 'seller'
  currentUserId: string
}

export default function LiveTradeInterface({ 
  trade: initialTrade, 
  userRole, 
  currentUserId 
}: LiveTradeInterfaceProps) {
  const [trade, setTrade] = useState(initialTrade)
  const [isConnected, setIsConnected] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel(`trade-${trade.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trades',
          filter: `id=eq.${trade.id}`,
        },
        (payload) => {
          logger.info('Real-time trade update received', {
            tradeId: trade.id,
            newStatus: payload.new.status,
            userId: currentUserId
          })
          
          setTrade((prevTrade: any) => ({
            ...prevTrade,
            ...payload.new
          }))
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          logger.info('Real-time subscription established', {
            tradeId: trade.id,
            userId: currentUserId
          })
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false)
          logger.error('Real-time subscription error', undefined, {
            tradeId: trade.id,
            userId: currentUserId
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [trade.id, currentUserId, supabase])

  const handleStatusUpdate = (newStatus: TradeStatus) => {
    // Optimistic update - the real-time subscription will confirm
    setTrade((prevTrade: any) => ({
      ...prevTrade,
      status: newStatus
    }))
  }

  const tradeState = getTradeState(trade.status as TradeStatus)
  const otherUser = userRole === 'buyer' ? trade.seller : trade.buyer
  const offer = trade.offers

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Trade</h1>
            <p className="text-gray-600">Trade ID: {trade.id.slice(0, 8)}...</p>
          </div>
          <div className="flex items-center space-x-3">
            <TradeStatusBadge status={trade.status} />
            {isConnected ? (
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm">Live</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">Disconnected</span>
              </div>
            )}
          </div>
        </div>

        {/* Trade Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Trading Pair</h3>
            <p className="text-lg font-semibold">
              {offer.crypto_asset} → {offer.fiat_currency}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Amount</h3>
            <p className="text-lg font-semibold">
              {trade.crypto_amount} {offer.crypto_asset}
            </p>
            <p className="text-sm text-gray-600">
              {formatCurrency(trade.fiat_amount, offer.fiat_currency)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Rate</h3>
            <p className="text-lg font-semibold">
              {formatCurrency(offer.price_per_crypto, offer.fiat_currency)}
            </p>
            <p className="text-sm text-gray-600">per {offer.crypto_asset}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <TradeProgressSteps currentStatus={trade.status} />

      {/* Current State */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{tradeState.title}</h2>
        <p className="text-gray-600 mb-6">{tradeState.description}</p>

        {/* User Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Your Actions</h3>
          <TradeActions
            tradeId={trade.id}
            currentStatus={trade.status}
            userRole={userRole}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>

      {/* Trading Partner Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Trading Partner ({userRole === 'buyer' ? 'Seller' : 'Buyer'})
        </h3>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {otherUser?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{otherUser?.username || 'Unknown'}</p>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                otherUser?.trust_scores?.tier === 'gold' ? 'bg-yellow-500' :
                otherUser?.trust_scores?.tier === 'silver' ? 'bg-gray-400' :
                otherUser?.trust_scores?.tier === 'bronze' ? 'bg-amber-600' :
                'bg-gray-400'
              }`}></div>
              <span className="text-sm text-gray-500 capitalize">
                {otherUser?.trust_scores?.tier || 'Unverified'}
              </span>
              <span className="text-sm text-gray-500">
                • {otherUser?.trust_scores?.total_trades || 0} trades
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      {trade.status === 'in_progress' && userRole === 'buyer' && offer.payment_method_details && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Payment Instructions</h3>
          <div className="space-y-2">
            <p className="text-sm text-blue-800">
              <strong>Method:</strong> {offer.payment_method_details.method}
            </p>
            {offer.payment_method_details.details && (
              <p className="text-sm text-blue-800">
                <strong>Details:</strong> {offer.payment_method_details.details}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Trade Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-600">Trade created</span>
            <span className="ml-auto text-gray-500">{formatDate(trade.created_at)}</span>
          </div>
          {trade.completed_at && (
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Trade completed</span>
              <span className="ml-auto text-gray-500">{formatDate(trade.completed_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-500"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}