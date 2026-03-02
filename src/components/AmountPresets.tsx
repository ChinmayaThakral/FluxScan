const PRESETS = ['100', '500', '1000', '2000']

interface AmountPresetsProps {
  onSelect: (amount: string) => void
  current: string
}

export default function AmountPresets({ onSelect, current }: AmountPresetsProps) {
  return (
    <div className="flex gap-2.5">
      {PRESETS.map((amt) => (
        <button
          key={amt}
          onClick={() => onSelect(amt === current ? '' : amt)}
          className={`
            flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
            ${amt === current
              ? 'bg-accent/15 text-accent'
              : 'text-text-secondary/70 hover:text-text-primary hover:bg-hover-bg'
            }
          `}
        >
          ₹{Number(amt).toLocaleString('en-IN')}
        </button>
      ))}
    </div>
  )
}
