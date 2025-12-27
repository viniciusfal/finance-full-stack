'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Transações', href: '/transacoes' },
  { name: 'Categorias', href: '/categorias' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-brand-base">
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
                        ? 'font-semibold text-brand-base'
                        : 'font-normal text-gray-600 hover:text-gray-800'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-800">
            CT
          </div>
        </div>
      </div>
    </nav>
  )
}

