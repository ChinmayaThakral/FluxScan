import { type ReactNode, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: ReactNode
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-accent text-white hover:bg-accent-hover active:scale-[0.97] shadow-lg shadow-accent/20 disabled:hover:bg-accent',
    secondary:
      'bg-card-elevated text-text-primary border border-border-subtle hover:bg-[#22222c] active:scale-[0.97]',
    ghost:
      'text-text-secondary hover:text-text-primary hover:bg-white/5 active:scale-[0.97]',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
