import { Sun, Moon } from 'lucide-react'
import type { Theme } from '../utils/storage'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="w-full flex items-start justify-between pt-14 pb-10">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-text-primary mb-2">
          Flux<span className="text-accent">Scan</span>
        </h1>
        <p className="text-base text-text-secondary/70">
          generate. scan. done.
        </p>
        <p className="text-xs text-text-secondary/30 mt-1.5 tracking-wide">
          Built by merchants. For merchants.
        </p>
      </div>
      <button
        onClick={onToggleTheme}
        className="mt-1 p-3 rounded-xl hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark'
          ? <Sun className="w-[18px] h-[18px] text-text-secondary/50" />
          : <Moon className="w-[18px] h-[18px] text-text-secondary/50" />
        }
      </button>
    </header>
  )
}
