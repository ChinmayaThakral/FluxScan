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
      <p className="text-base font-semibold text-text-primary mb-1">
        Payment status?
      </p>
      <p className="text-xs text-text-secondary/50 mb-6">
        Helps track your history.
      </p>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => onChoice('success')}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-success bg-success/[0.08] hover:bg-success/[0.12] transition-colors cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" />
          Done
        </button>
        <button
          onClick={() => onChoice('failed')}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-danger bg-danger/[0.08] hover:bg-danger/[0.12] transition-colors cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          Cancelled
        </button>
        <button
          onClick={() => onChoice('skip')}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm text-text-secondary/35 hover:text-text-secondary/60 hover:bg-white/[0.03] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Just reset
        </button>
      </div>
    </Modal>
  )
}
