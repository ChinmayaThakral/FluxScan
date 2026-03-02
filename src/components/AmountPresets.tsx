const PRESETS = ['100', '500', '1000', '2000']

interface AmountPresetsProps {
  onSelect: (amount: string) => void
  current: string
}

export default function AmountPresets({ onSelect, current }: AmountPresetsProps) {
  return (
    <div className="flex gap-2">
      {PRESETS.map((amt) => (
        <button
          key={amt}
          onClick={() => onSelect(amt === current ? '' : amt)}
          className={`
            flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer
            ${amt === current
              ? 'bg-accent/20 text-accent border border-accent/40'
              : 'bg-card-elevated text-text-secondary border border-border-subtle hover:text-text-primary hover:border-accent/20'
            }
          `}
        >
          ₹{Number(amt).toLocaleString('en-IN')}
        </button>
      ))}
    </div>
  )
}
