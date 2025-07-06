// Database Types for Confianza Platform

export type OfferStatus = 'active' | 'paused' | 'completed' | 'closed'
export type TradeStatus = 'pending' | 'in_progress' | 'payment_sent' | 'completed' | 'disputed' | 'cancelled'
export type DisputeStatus = 'open' | 'awaiting_response' | 'resolved_for_buyer' | 'resolved_for_seller' | 'resolved_by_mutual'
export type TrustTier = 'unverified' | 'bronze' | 'silver' | 'gold'
export type FeedbackRating = 'positive' | 'neutral' | 'negative'

export interface Profile {
  id: string
  username: string
  status: string
  invite_code_used?: string
  created_at: string
  updated_at: string
}

export interface Admin {
  user_id: string
  created_at: string
}

export interface Wallet {
  id: string
  user_id: string
  address: string
  wallet_type: string
  created_at: string
}

export interface TrustScore {
  user_id: string
  tier: TrustTier
  total_trades: number
  successful_trades: number
  disputes_opened: number
  disputes_involved: number
  total_trade_volume_usd: number
  positive_feedback: number
  negative_feedback: number
  last_calculated_at: string
}

export interface Offer {
  id: string
  user_id: string
  status: OfferStatus
  crypto_asset: string
  fiat_currency: string
  price_per_crypto: number
  min_trade_limit: number
  max_trade_limit: number
  available_amount: number
  payment_method_details?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Trade {
  id: string
  offer_id: string
  buyer_id: string
  seller_id: string
  status: TradeStatus
  crypto_amount: number
  fiat_amount: number
  fee_amount_usd: number
  escrow_contract_address: string
  created_at: string
  completed_at?: string
}

export interface Dispute {
  id: string
  trade_id: string
  opened_by_user_id: string
  status: DisputeStatus
  reason: string
  resolution_notes?: string
  created_at: string
  resolved_at?: string
}

export interface Feedback {
  id: string
  trade_id: string
  reviewer_id: string
  reviewee_id: string
  rating: FeedbackRating
  comment?: string
  created_at: string
}