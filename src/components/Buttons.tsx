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
    'inline-flex items-center justify-center gap-2.5 px-5 min-h-[52px] rounded-xl text-[15px] font-medium transition-all duration-200 ease-out cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-accent text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-accent/20 disabled:hover:brightness-100',
    secondary:
      'bg-surface-hover text-text-primary border border-border-subtle hover:bg-surface-hover/80 active:scale-[0.98]',
    ghost:
      'text-text-secondary/60 hover:text-text-primary hover:bg-hover-bg active:scale-[0.98]',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="flex-shrink-0 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  )
}
