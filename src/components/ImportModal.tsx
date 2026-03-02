import { Layers, Replace, X } from 'lucide-react'
import Modal from './Modal'

export type ImportChoice = 'merge' | 'replace' | 'cancel'

interface ImportModalProps {
  open: boolean
  count: number
  onClose: () => void
  onChoice: (choice: ImportChoice) => void
}

export default function ImportModal({ open, count, onClose, onChoice }: ImportModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <p className="text-base font-semibold text-text-primary mb-1">
        Import {count} {count === 1 ? 'entry' : 'entries'}
      </p>
      <p className="text-xs text-text-secondary/50 mb-6">
        Choose how to handle imported data.
      </p>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => onChoice('merge')}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-accent bg-accent/[0.08] hover:bg-accent/[0.14] transition-colors cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          Merge
        </button>
        <button
          onClick={() => onChoice('replace')}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-danger bg-danger/[0.08] hover:bg-danger/[0.14] transition-colors cursor-pointer"
        >
          <Replace className="w-4 h-4" />
          Replace
        </button>
        <button
          onClick={() => onChoice('cancel')}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm text-text-secondary/35 hover:text-text-secondary/60 hover:bg-hover-bg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </Modal>
  )
}
