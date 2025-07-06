import { TradeStatus } from '@/types/database'
import { cn } from '@/lib/utils'

interface TradeProgressStepsProps {
  currentStatus: TradeStatus
  className?: string
}

const PROGRESS_STEPS = [
  { key: 'pending', label: 'Initiated', description: 'Trade created' },
  { key: 'in_progress', label: 'Escrow Funded', description: 'Crypto deposited' },
  { key: 'payment_sent', label: 'Payment Sent', description: 'Fiat transferred' },
  { key: 'completed', label: 'Complete', description: 'Trade finished' },
]

export default function TradeProgressSteps({ currentStatus, className }: TradeProgressStepsProps) {
  const getCurrentStepIndex = () => {
    if (currentStatus === 'disputed' || currentStatus === 'cancelled') {
      return -1 // Special states don't follow normal progression
    }
    return PROGRESS_STEPS.findIndex(step => step.key === currentStatus)
  }

  const currentStepIndex = getCurrentStepIndex()

  if (currentStatus === 'disputed') {
    return (
      <div className={cn('bg-red-50 border border-red-200 rounded-lg p-4', className)}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Trade Disputed</h3>
            <p className="text-sm text-red-700">This trade is under review by administrators</p>
          </div>
        </div>
      </div>
    )
  }

  if (currentStatus === 'cancelled') {
    return (
      <div className={cn('bg-gray-50 border border-gray-200 rounded-lg p-4', className)}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">Trade Cancelled</h3>
            <p className="text-sm text-gray-700">This trade has been cancelled</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-6', className)}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Trade Progress</h3>
      <nav aria-label="Progress">
        <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {PROGRESS_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            const isUpcoming = index > currentStepIndex

            return (
              <li key={step.key} className="md:flex-1">
                <div
                  className={cn(
                    'group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4',
                    {
                      'border-blue-600': isCurrent,
                      'border-green-600': isCompleted,
                      'border-gray-200': isUpcoming,
                    }
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-medium',
                      {
                        'text-blue-600': isCurrent,
                        'text-green-600': isCompleted,
                        'text-gray-500': isUpcoming,
                      }
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-sm text-gray-500">{step.description}</span>
                </div>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}