import { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  state?: 'empty' | 'filled' | 'disabled'
}

export function Input({
  label,
  helper,
  error,
  leftIcon,
  rightIcon,
  state = 'empty',
  className,
  ...props
}: InputProps) {
  const isDisabled = state === 'disabled' || props.disabled

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white px-3 py-3.5 text-base',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent',
            'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
            'dark:focus:ring-green-500',
            {
              'pl-10': leftIcon,
              'pr-10': rightIcon,
              'opacity-50 cursor-not-allowed': isDisabled,
            },
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          disabled={isDisabled}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      {helper && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helper}</p>
      )}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
}

