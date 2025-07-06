import StatusBadge from '@/components/ui/StatusBadge'
import { TradeStatus } from '@/types/database'

interface TradeStatusBadgeProps {
  status: TradeStatus
  className?: string
}

export default function TradeStatusBadge({ status, className }: TradeStatusBadgeProps) {
  return <StatusBadge status={status} className={className} />
}