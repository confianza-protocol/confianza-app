import { cn } from '@/lib/utils'
import { TrustTier } from '@/types/database'

interface TrustBadgeProps {
  tier: TrustTier
  showIcon?: boolean
  className?: string
}

const trustConfig = {
  gold: {
    className: 'trust-gold',
    icon: '🥇',
    label: 'Gold'
  },
  silver: {
    className: 'trust-silver', 
    icon: '🥈',
    label: 'Silver'
  },
  bronze: {
    className: 'trust-bronze',
    icon: '🥉', 
    label: 'Bronze'
  },
  unverified: {
    className: 'trust-unverified',
    icon: '⚪',
    label: 'Unverified'
  }
}

export default function TrustBadge({ tier, showIcon = true, className }: TrustBadgeProps) {
  const config = trustConfig[tier]
  
  return (
    <span className={cn(config.className, className)}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  )
}