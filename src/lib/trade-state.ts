import { TradeStatus } from '@/types/database'

export interface TradeState {
  status: TradeStatus
  title: string
  description: string
  buyerActions: string[]
  sellerActions: string[]
  canDispute: boolean
  isComplete: boolean
  nextStatus?: TradeStatus
}

export const TRADE_STATES: Record<TradeStatus, TradeState> = {
  pending: {
    status: 'pending',
    title: 'Trade Initiated',
    description: 'Waiting for seller to deposit crypto into escrow',
    buyerActions: ['Wait for seller deposit'],
    sellerActions: ['Deposit crypto to escrow'],
    canDispute: false,
    isComplete: false,
    nextStatus: 'in_progress'
  },
  in_progress: {
    status: 'in_progress',
    title: 'Escrow Funded',
    description: 'Seller has deposited crypto. Buyer should now send fiat payment.',
    buyerActions: ['Send fiat payment', 'Mark payment as sent'],
    sellerActions: ['Wait for buyer payment'],
    canDispute: true,
    isComplete: false,
    nextStatus: 'payment_sent'
  },
  payment_sent: {
    status: 'payment_sent',
    title: 'Payment Sent',
    description: 'Buyer has marked payment as sent. Seller should verify and confirm receipt.',
    buyerActions: ['Wait for seller confirmation'],
    sellerActions: ['Verify payment received', 'Confirm payment'],
    canDispute: true,
    isComplete: false,
    nextStatus: 'completed'
  },
  completed: {
    status: 'completed',
    title: 'Trade Complete',
    description: 'Trade has been successfully completed. Crypto has been released to buyer.',
    buyerActions: ['Leave feedback'],
    sellerActions: ['Leave feedback'],
    canDispute: false,
    isComplete: true
  },
  disputed: {
    status: 'disputed',
    title: 'Trade Disputed',
    description: 'A dispute has been opened. Please wait for admin resolution.',
    buyerActions: ['Wait for resolution'],
    sellerActions: ['Wait for resolution'],
    canDispute: false,
    isComplete: false
  },
  cancelled: {
    status: 'cancelled',
    title: 'Trade Cancelled',
    description: 'This trade has been cancelled.',
    buyerActions: [],
    sellerActions: [],
    canDispute: false,
    isComplete: true
  }
}

export function getTradeState(status: TradeStatus): TradeState {
  return TRADE_STATES[status]
}

export function getAvailableActions(status: TradeStatus, userRole: 'buyer' | 'seller'): string[] {
  const state = getTradeState(status)
  return userRole === 'buyer' ? state.buyerActions : state.sellerActions
}

export function canUserDispute(status: TradeStatus): boolean {
  return getTradeState(status).canDispute
}

export function getNextStatus(currentStatus: TradeStatus): TradeStatus | null {
  return getTradeState(currentStatus).nextStatus || null
}