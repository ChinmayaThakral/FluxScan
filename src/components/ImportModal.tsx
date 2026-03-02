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
      <h3 className="text-base font-semibold text-text-primary mb-1">
        Import {count} log {count === 1 ? 'entry' : 'entries'}
      </h3>
      <p className="text-xs text-text-secondary mb-5">
        How should imported data be handled?
      </p>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => onChoice('merge')}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 text-sm font-medium text-accent hover:bg-accent/15 transition-colors cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          Merge with existing
        </button>
        <button
          onClick={() => onChoice('replace')}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-sm font-medium text-danger hover:bg-danger/15 transition-colors cursor-pointer"
        >
          <Replace className="w-4 h-4" />
          Replace existing
        </button>
        <button
          onClick={() => onChoice('cancel')}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-card-elevated border border-border-subtle text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </Modal>
  )
}
