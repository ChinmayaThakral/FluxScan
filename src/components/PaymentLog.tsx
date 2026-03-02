import { useState } from 'react'
import { History, Copy, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { PaymentLogEntry } from '../utils/storage'
import { clearPaymentLog } from '../utils/storage'

interface PaymentLogProps {
  entries: PaymentLogEntry[]
  onClear: () => void
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  if (isToday) return `Today, ${time}`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + `, ${time}`
}

export default function PaymentLog({ entries, onClear }: PaymentLogProps) {
  const [expanded, setExpanded] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (entries.length === 0) return null

  const visible = expanded ? entries : entries.slice(0, 3)

  async function handleCopy(entry: PaymentLogEntry) {
    try {
      await navigator.clipboard.writeText(entry.link)
      setCopiedId(entry.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch { /* */ }
  }

  function handleClear() {
    clearPaymentLog()
    onClear()
  }

  return (
    <div className="mt-6 rounded-2xl bg-card border border-border-subtle p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
          <History className="w-3.5 h-3.5" />
          Payment Log
        </p>
        <button
          onClick={handleClear}
          className="text-[10px] text-text-secondary/40 hover:text-danger transition-colors cursor-pointer flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {visible.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-card-elevated border border-border-subtle"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate">{entry.name || entry.vpa}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {entry.amount && (
                  <span className="text-xs font-semibold text-accent">₹{entry.amount}</span>
                )}
                <span className="text-[10px] text-text-secondary/50">{formatTime(entry.timestamp)}</span>
              </div>
            </div>
            <button
              onClick={() => handleCopy(entry)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0"
              title="Copy link"
            >
              {copiedId === entry.id
                ? <Check className="w-3.5 h-3.5 text-success" />
                : <Copy className="w-3.5 h-3.5 text-text-secondary/60" />
              }
            </button>
          </div>
        ))}
      </div>

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
    </div>
  )
}
