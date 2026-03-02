import { useState, useRef } from 'react'
import { History, Copy, Check, Trash2, ChevronDown, ChevronUp, Download, Upload } from 'lucide-react'
import type { PaymentLogEntry } from '../utils/storage'
import { clearPaymentLog, deleteLogEntry, exportLog, validateImport } from '../utils/storage'
import type { ExportData } from '../utils/storage'
import ImportModal, { type ImportChoice } from './ImportModal'

interface PaymentLogProps {
  entries: PaymentLogEntry[]
  onUpdate: () => void
  onImport: (data: ExportData, choice: ImportChoice) => void
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - ts
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const isThisYear = d.getFullYear() === now.getFullYear()
  const datePart = d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    ...(isThisYear ? {} : { year: 'numeric' }),
  })
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  return `${datePart}, ${time}`
}

export default function PaymentLog({ entries, onUpdate, onImport }: PaymentLogProps) {
  const [expanded, setExpanded] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [importData, setImportData] = useState<ExportData | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const visible = expanded ? entries : entries.slice(0, 3)

  async function handleCopy(entry: PaymentLogEntry) {
    try {
      await navigator.clipboard.writeText(entry.link)
      setCopiedId(entry.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch { /* */ }
  }

  function handleDelete(id: string) {
    setDeletingId(id)
    setTimeout(() => {
      deleteLogEntry(id)
      setDeletingId(null)
      onUpdate()
    }, 250)
  }

  function handleClear() {
    clearPaymentLog()
    onUpdate()
  }

  function handleExport() {
    const data = exportLog()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const d = new Date()
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const link = document.createElement('a')
    link.download = `fluxscan-log-${dateStr}.json`
    link.href = url
    link.click()
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
        if (!validated || validated.log.length === 0) {
          setImportError('Invalid or empty log file')
          return
        }
        setImportData(validated)
      } catch {
        setImportError('Could not parse file')
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleImportChoice(choice: ImportChoice) {
    if (choice !== 'cancel' && importData) {
      onImport(importData, choice)
    }
    setImportData(null)
  }

  return (
    <>
      <div className="mt-6 rounded-2xl bg-card border border-border-subtle p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            Payment Log
            {entries.length > 0 && (
              <span className="text-text-secondary/40">({entries.length})</span>
            )}
          </p>
          {entries.length > 0 && (
            <button
              onClick={handleClear}
              className="text-[10px] text-text-secondary/40 hover:text-danger transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="text-xs text-text-secondary/40 text-center py-3">No entries yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {visible.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card-elevated border border-border-subtle transition-all duration-250 ${
                  deletingId === entry.id ? 'opacity-0 scale-95 max-h-0 py-0 my-0 overflow-hidden' : 'opacity-100 max-h-24'
                }`}
              >
                {/* Status dot */}
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    entry.status === 'success' ? 'bg-success' : 'bg-danger'
                  }`}
                  title={entry.status === 'success' ? 'Successful' : 'Cancelled'}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{entry.name || entry.vpa}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {entry.amount && (
                      <span className="text-xs font-semibold text-accent">₹{entry.amount}</span>
                    )}
                    <span className="text-[10px] text-text-secondary/50">{formatTime(entry.timestamp)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(entry)}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    title="Copy link"
                  >
                    {copiedId === entry.id
                      ? <Check className="w-3.5 h-3.5 text-success" />
                      : <Copy className="w-3.5 h-3.5 text-text-secondary/60" />
                    }
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg hover:bg-white/5 hover:text-danger transition-colors cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-text-secondary/40" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {entries.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-2 py-1.5 text-[11px] text-text-secondary/50 hover:text-text-secondary flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            {expanded ? (
              <><ChevronUp className="w-3 h-3" /> Show less</>
            ) : (
              <><ChevronDown className="w-3 h-3" /> {entries.length - 3} more</>
            )}
          </button>
        )}

        {/* Export / Import */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-border-subtle">
          <button
            onClick={handleExport}
            disabled={entries.length === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium text-text-secondary/60 hover:text-text-primary bg-card-elevated border border-border-subtle hover:border-accent/20 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Download className="w-3 h-3" />
            Export Log
          </button>
          <label className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium text-text-secondary/60 hover:text-text-primary bg-card-elevated border border-border-subtle hover:border-accent/20 transition-all cursor-pointer">
            <Upload className="w-3 h-3" />
            Import Log
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="sr-only"
            />
          </label>
        </div>

        {importError && (
          <p className="text-xs text-danger mt-2 text-center">{importError}</p>
        )}
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
