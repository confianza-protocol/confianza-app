import { TradeStatus } from '@/types/database'
import { cn } from '@/lib/utils'

interface TradeStatusBadgeProps {
  status: TradeStatus
  className?: string
}

export default function TradeStatusBadge({ status, className }: TradeStatusBadgeProps) {
  const getStatusConfig = (status: TradeStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
      case 'in_progress':
        return {
          label: 'In Progress',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        }
      case 'payment_sent':
        return {
          label: 'Payment Sent',
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        }
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-green-100 text-green-800 border-green-200'
        }
      case 'disputed':
        return {
          label: 'Disputed',
          className: 'bg-red-100 text-red-800 border-red-200'
        }
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}