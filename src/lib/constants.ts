// App constants
export const APP_NAME = 'Confianza'
export const APP_DESCRIPTION = 'The safest way to buy and sell crypto in Latin America'

// Trust tier constants
export const TRUST_TIERS = {
  UNVERIFIED: 'unverified',
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
} as const

// Trade status constants
export const TRADE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  PAYMENT_SENT: 'payment_sent',
  COMPLETED: 'completed',
  DISPUTED: 'disputed',
  CANCELLED: 'cancelled',
} as const

// Offer status constants
export const OFFER_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CLOSED: 'closed',
} as const

// Feedback rating constants
export const FEEDBACK_RATING = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative',
} as const

// Dispute status constants
export const DISPUTE_STATUS = {
  OPEN: 'open',
  AWAITING_RESPONSE: 'awaiting_response',
  RESOLVED_FOR_BUYER: 'resolved_for_buyer',
  RESOLVED_FOR_SELLER: 'resolved_for_seller',
  RESOLVED_BY_MUTUAL: 'resolved_by_mutual',
} as const

// UI constants
export const PAGINATION_LIMIT = 10
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Validation constants
export const MIN_PASSWORD_LENGTH = 6
export const MIN_USERNAME_LENGTH = 3
export const MAX_USERNAME_LENGTH = 20
export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/

// Network constants
export const NETWORK_NAME = 'Base Goerli'
export const NETWORK_ID = 84531 