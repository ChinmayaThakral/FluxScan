import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import Modal from './Modal'

export type ResetChoice = 'success' | 'failed' | 'skip'

interface ResetModalProps {
  open: boolean
  onClose: () => void
  onChoice: (choice: ResetChoice) => void
}

export default function ResetModal({ open, onClose, onChoice }: ResetModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-base font-semibold text-text-primary mb-1">
        Was this payment successful?
      </h3>
      <p className="text-xs text-text-secondary mb-5">
        This helps you track your payment history.
      </p>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => onChoice('success')}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-success/10 border border-success/20 text-sm font-medium text-success hover:bg-success/15 transition-colors cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" />
          Mark as Done
        </button>
        <button
          onClick={() => onChoice('failed')}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-sm font-medium text-danger hover:bg-danger/15 transition-colors cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          Mark as Cancelled
        </button>
        <button
          onClick={() => onChoice('skip')}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-card-elevated border border-border-subtle text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Just Reset
        </button>
      </div>
    </Modal>
  )
}
