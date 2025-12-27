'use client'

import { useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettlementToggleProps {
  mode: 'all' | 'settled'
  onModeChange: (mode: 'all' | 'settled') => void
}

export function SettlementToggle({ mode, onModeChange }: SettlementToggleProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => onModeChange('all')}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          mode === 'all'
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
        )}
      >
        <Circle className="h-4 w-4" />
        Previsto
      </button>
      <button
        type="button"
        onClick={() => onModeChange('settled')}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          mode === 'settled'
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
        )}
      >
        <CheckCircle2 className="h-4 w-4" />
        Liquidado
      </button>
    </div>
  )
}

