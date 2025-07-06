import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusConfig: Record<string, { className: string; label: string }> = {
  pending: { className: 'status-pending', label: 'Pending' },
  active: { className: 'status-active', label: 'Active' },
  in_progress: { className: 'status-pending', label: 'In Progress' },
  payment_sent: { className: 'status-pending', label: 'Payment Sent' },
  completed: { className: 'status-completed', label: 'Completed' },
  disputed: { className: 'status-error', label: 'Disputed' },
  cancelled: { className: 'status-error', label: 'Cancelled' },
  paused: { className: 'status-pending', label: 'Paused' },
  closed: { className: 'status-error', label: 'Closed' }
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { className: 'status-pending', label: status }
  
  return (
    <span className={cn(config.className, className)}>
      {config.label}
    </span>
  )
}