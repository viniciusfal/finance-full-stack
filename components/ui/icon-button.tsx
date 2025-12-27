import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'danger'
  icon: ReactNode
  'aria-label': string
}

export function IconButton({
  variant = 'outline',
  icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg p-2 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-base',
        {
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50':
            variant === 'outline',
          'border border-red-300 bg-white text-red-700 hover:bg-red-50':
            variant === 'danger',
          'opacity-50 cursor-not-allowed': props.disabled,
        },
        className
      )}
      {...props}
    >
      {icon}
    </button>
  )
}

