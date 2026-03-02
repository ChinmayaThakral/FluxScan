import { Clock } from 'lucide-react'
import type { RecentVpa } from '../utils/storage'

interface RecentVpasProps {
  items: RecentVpa[]
  onSelect: (vpa: string, name: string) => void
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function RecentVpas({ items, onSelect }: RecentVpasProps) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-text-secondary/60 flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        Recent
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.vpa}
            onClick={() => onSelect(item.vpa, item.name)}
            className="px-3 py-1.5 rounded-lg bg-card-elevated border border-border-subtle text-xs text-text-secondary hover:text-text-primary hover:border-accent/30 transition-all duration-200 cursor-pointer truncate max-w-[200px]"
            title={`${item.vpa} · ${timeAgo(item.timestamp)}`}
          >
            {item.name || item.vpa}
          </button>
        ))}
      </div>
    </div>
  )
}
