'use client'

import { useState } from 'react'
import { TradeStatus } from '@/types/database'
import { getTradeState, getNextStatus } from '@/lib/trade-state'
import { logger } from '@/lib/logger'

interface TradeActionsProps {
  tradeId: string
  currentStatus: TradeStatus
  userRole: 'buyer' | 'seller'
  onStatusUpdate: (newStatus: TradeStatus) => void
  disabled?: boolean
}

export default function TradeActions({
  tradeId,
  currentStatus,
  userRole,
  onStatusUpdate,
  disabled = false
}: TradeActionsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const tradeState = getTradeState(currentStatus)
  const nextStatus = getNextStatus(currentStatus)

  const handleStatusUpdate = async (newStatus: TradeStatus) => {
    setLoading(true)
    setError('')

    try {
      logger.info('User attempting to update trade status', {
        tradeId,
        currentStatus,
        newStatus,
        userRole
      })

      const response = await fetch('/api/trades/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tradeId,
          newStatus,
          userRole
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update trade status')
      }

      const result = await response.json()
      onStatusUpdate(result.status)

      logger.info('Trade status updated successfully', {
        tradeId,
        oldStatus: currentStatus,
        newStatus: result.status,
        userRole
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      logger.error('Failed to update trade status', err as Error, {
        tradeId,
        currentStatus,
        newStatus,
        userRole
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDispute = () => {
    handleStatusUpdate('disputed')
  }

  const handleNextStep = () => {
    if (nextStatus) {
      handleStatusUpdate(nextStatus)
    }
  }

  const getActionButton = () => {
    if (tradeState.isComplete) {
      return (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
        >
          Trade Complete
        </button>
      )
    }

    if (currentStatus === 'disputed') {
      return (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
        >
          Awaiting Resolution
        </button>
      )
    }

    // Determine if user can take action based on role and current status
    const canTakeAction = () => {
      switch (currentStatus) {
        case 'pending':
          return userRole === 'seller'
        case 'in_progress':
          return userRole === 'buyer'
        case 'payment_sent':
          return userRole === 'seller'
        default:
          return false
      }
    }

    const getActionText = () => {
      switch (currentStatus) {
        case 'pending':
          return userRole === 'seller' ? 'Deposit Crypto to Escrow' : 'Waiting for Seller'
        case 'in_progress':
          return userRole === 'buyer' ? 'Mark Payment as Sent' : 'Waiting for Buyer Payment'
        case 'payment_sent':
          return userRole === 'seller' ? 'Confirm Payment Received' : 'Waiting for Seller Confirmation'
        default:
          return 'No Action Available'
      }
    }

    if (!canTakeAction()) {
      return (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
        >
          {getActionText()}
        </button>
      )
    }

    return (
      <button
        onClick={handleNextStep}
        disabled={loading || disabled}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
      >
        {loading ? 'Processing...' : getActionText()}
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {getActionButton()}

      {tradeState.canDispute && (
        <button
          onClick={handleDispute}
          disabled={loading || disabled}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Processing...' : 'Report a Problem'}
        </button>
      )}
    </div>
  )
}