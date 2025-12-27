'use client'

import NextLink from 'next/link'
import { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ClientLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  children: ReactNode
  href: string
}

export function ClientLink({
  icon,
  iconPosition = 'right',
  className,
  children,
  href,
  ...props
}: ClientLinkProps) {
  return (
    <NextLink
      href={href}
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium text-brand-base hover:underline dark:text-green-400',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="w-4 h-4">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="w-4 h-4">{icon}</span>}
    </NextLink>
  )
}

