import { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  children: ReactNode
}

export function Link({
  icon,
  iconPosition = 'right',
  className,
  children,
  ...props
}: LinkProps) {
  return (
    <a
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium text-brand-base hover:underline',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="w-4 h-4">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="w-4 h-4">{icon}</span>}
    </a>
  )
}

