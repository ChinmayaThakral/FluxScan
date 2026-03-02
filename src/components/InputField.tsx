import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, error, id, ...props }, ref) {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl bg-card-elevated text-text-primary
            border transition-all duration-200 ease-in-out
            placeholder:text-text-secondary/40 text-sm
            focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50
            ${error ? 'border-danger/60' : 'border-border-subtle'}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger mt-0.5">{error}</p>
        )}
      </div>
    )
  }
)

export default InputField
