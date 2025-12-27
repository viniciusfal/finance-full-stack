'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Transações', href: '/transacoes' },
  { name: 'Categorias', href: '/categorias' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-brand-base dark:text-green-400">
              Financy
            </Link>
            <div className="flex items-center gap-5">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm transition-colors',
                      isActive
                        ? 'font-semibold text-brand-base dark:text-green-400'
                        : 'font-normal text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              CT
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

