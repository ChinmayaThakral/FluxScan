import { useState, useRef } from 'react'
import { Copy, Check, Trash2, ChevronDown, ChevronUp, Download, Upload } from 'lucide-react'
import type { PaymentLogEntry, ExportData } from '../utils/storage'
import { clearPaymentLog, deleteLogEntry, exportLog, validateImport } from '../utils/storage'
import ImportModal, { type ImportChoice } from './ImportModal'

interface PaymentLogProps {
  entries: PaymentLogEntry[]
  onUpdate: () => void
  onImport: (data: ExportData, choice: ImportChoice) => void
}

function formatTime(ts: number): string {
  const diffMs = Date.now() - ts
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const d = new Date(ts)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) +
    ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function PaymentLog({ entries, onUpdate, onImport }: PaymentLogProps) {
  const [expanded, setExpanded] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [importData, setImportData] = useState<ExportData | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleCopy(entry: PaymentLogEntry) {
    try {
      await navigator.clipboard.writeText(entry.link)
      setCopiedId(entry.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch { /* */ }
  }

  function handleDelete(id: string) {
    setDeletingId(id)
    setTimeout(() => { deleteLogEntry(id); setDeletingId(null); onUpdate() }, 250)
  }

  function handleExport() {
    const data = exportLog()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const d = new Date()
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const a = document.createElement('a')
    a.download = `fluxscan-log-${dateStr}.json`
    a.href = url
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportError(null)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string)
        const validated = validateImport(raw)
        if (!validated || validated.log.length === 0) { setImportError('Invalid or empty log file'); return }
        setImportData(validated)
      } catch { setImportError('Could not parse file') }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleImportChoice(choice: ImportChoice) {
    if (choice !== 'cancel' && importData) onImport(importData, choice)
    setImportData(null)
  }

  if (entries.length === 0) return null

  return (
    <>
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full py-2 cursor-pointer"
        >
          <p className="text-xs uppercase tracking-widest text-text-secondary/30 font-medium flex items-center gap-2">
            History
            <span className="text-text-secondary/20">({entries.length})</span>
          </p>
          <div className="flex items-center gap-3">
            <span
              onClick={(e) => { e.stopPropagation(); clearPaymentLog(); onUpdate() }}
              className="text-xs text-text-secondary/20 hover:text-danger/70 transition-colors"
            >
              Clear
            </span>
            {expanded
              ? <ChevronUp className="w-4 h-4 text-text-secondary/20" />
              : <ChevronDown className="w-4 h-4 text-text-secondary/20" />
            }
          </div>
        </button>

        {expanded && (
          <div className="mt-3 flex flex-col max-h-[320px] overflow-y-auto">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-hover-bg transition-all duration-200 ${
                  deletingId === entry.id ? 'opacity-0 scale-95 max-h-0 py-0 overflow-hidden' : ''
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${entry.status === 'success' ? 'bg-success/70' : 'bg-danger/70'}`} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary/80 truncate">{entry.name || entry.vpa}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {entry.amount && <span className="text-xs text-text-secondary/50">₹{entry.amount}</span>}
                    <span className="text-[10px] text-text-secondary/25">{formatTime(entry.timestamp)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button onClick={() => handleCopy(entry)} className="p-2 rounded-lg hover:bg-hover-bg transition-colors cursor-pointer">
                    {copiedId === entry.id
                      ? <Check className="w-3.5 h-3.5 text-success/70" />
                      : <Copy className="w-3.5 h-3.5 text-text-secondary/20" />
                    }
                  </button>
                  <button onClick={() => handleDelete(entry.id)} className="p-2 rounded-lg hover:bg-hover-bg transition-colors cursor-pointer group/del">
                    <Trash2 className="w-3.5 h-3.5 text-text-secondary/15 group-hover/del:text-danger/60" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {expanded && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleExport}
              disabled={entries.length === 0}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs text-text-secondary/25 hover:text-text-secondary/50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <label className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs text-text-secondary/25 hover:text-text-secondary/50 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Import
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} className="sr-only" />
            </label>
          </div>
        )}

        {importError && <p className="text-xs text-danger/70 mt-3 text-center">{importError}</p>}
      </div>

      <ImportModal
        open={!!importData}
        count={importData?.log.length ?? 0}
        onClose={() => setImportData(null)}
        onChoice={handleImportChoice}
      />
    </>
  )
}
