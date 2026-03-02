import { Sun, Moon } from 'lucide-react'
import type { Theme } from '../utils/storage'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="w-full max-w-[480px] flex items-center justify-between pt-10 pb-6 px-1">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
            Flux<span className="text-accent">Scan</span>
          </h1>
          <span className="w-2 h-2 rounded-full bg-accent inline-block mt-1 animate-pulse-subtle" />
        </div>
        <p className="text-sm tracking-wide text-text-secondary">
          generate. scan. done.
        </p>
      </div>
      <button
        onClick={onToggleTheme}
        className="p-2.5 rounded-xl bg-card border border-border-subtle hover:border-accent/30 transition-all duration-200 cursor-pointer"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark'
          ? <Sun className="w-4 h-4 text-text-secondary" />
          : <Moon className="w-4 h-4 text-text-secondary" />
        }
      </button>
    </header>
  )
}
