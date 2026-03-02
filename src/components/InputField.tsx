import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, error, id, className = '', ...props }, ref) {
    return (
      <div className="flex flex-col gap-2.5">
        <label htmlFor={id} className="text-xs uppercase tracking-widest text-text-secondary/60 font-medium pl-1">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`
            w-full px-5 h-[58px] rounded-xl
            bg-transparent text-text-primary text-lg
            border border-white/[0.08]
            transition-all duration-200 ease-out
            placeholder:text-text-secondary/25
            focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/[0.08]
            hover:border-white/[0.12]
            ${error ? '!border-danger/50 !ring-danger/[0.08]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger/80 pl-1">{error}</p>
        )}
      </div>
    )
  }
)

export default InputField
