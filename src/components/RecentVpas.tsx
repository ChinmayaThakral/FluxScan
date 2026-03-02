import type { RecentVpa } from '../utils/storage'

interface RecentVpasProps {
  items: RecentVpa[]
  onSelect: (vpa: string, name: string) => void
}

export default function RecentVpas({ items, onSelect }: RecentVpasProps) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs uppercase tracking-widest text-text-secondary/30 font-medium pl-1">
        Recent
      </p>
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {items.map((item) => (
          <button
            key={item.vpa}
            onClick={() => onSelect(item.vpa, item.name)}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-sm text-text-secondary/50 hover:text-text-primary hover:bg-white/[0.05] transition-all duration-200 cursor-pointer truncate max-w-[180px]"
          >
            {item.name || item.vpa}
          </button>
        ))}
      </div>
    </div>
  )
}
