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
            bg-input-bg text-text-primary text-lg
            border border-input-border
            transition-all duration-200 ease-out
            placeholder:text-text-secondary/25
            focus:outline-none focus:border-input-border-focus focus:ring-4 focus:ring-input-ring
            hover:border-input-border-hover
            ${error ? '!border-danger/50 !ring-danger/10' : ''}
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
