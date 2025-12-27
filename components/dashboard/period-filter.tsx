'use client'

import { useEffect, useState, Suspense } from 'react'
import { generateAvailablePeriods } from '@/lib/utils'

interface DashboardPeriodFilterProps {
  onPeriodChange: (period: string | null) => void
  defaultPeriod?: string | null
}

function DashboardPeriodFilterContent({
  onPeriodChange,
  defaultPeriod,
}: DashboardPeriodFilterProps) {
  const [periods, setPeriods] = useState<Array<{ label: string; value: string }>>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>(defaultPeriod || '')

  useEffect(() => {
    // Gerar períodos dos últimos 12 meses até o mês atual
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
    const availablePeriods = generateAvailablePeriods(startDate, now)
    setPeriods(availablePeriods.map((p) => ({ label: p.label, value: p.value })))

    // Se não houver período selecionado, usar o mês atual
    if (!defaultPeriod && availablePeriods.length > 0) {
      const currentPeriod = availablePeriods[0].value
      setSelectedPeriod(currentPeriod)
      onPeriodChange(currentPeriod)
    } else if (defaultPeriod) {
      setSelectedPeriod(defaultPeriod)
    }
  }, [defaultPeriod, onPeriodChange])

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const period = e.target.value
    setSelectedPeriod(period)
    onPeriodChange(period || null)
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Período
      </label>
      <select
        value={selectedPeriod}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      >
        {periods.length === 0 ? (
          <option>Carregando...</option>
        ) : (
          periods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))
        )}
      </select>
    </div>
  )
}

export function DashboardPeriodFilter({
  onPeriodChange,
  defaultPeriod,
}: DashboardPeriodFilterProps) {
  return (
    <Suspense
      fallback={
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Período
          </label>
          <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
            <option>Carregando...</option>
          </select>
        </div>
      }
    >
      <DashboardPeriodFilterContent
        onPeriodChange={onPeriodChange}
        defaultPeriod={defaultPeriod}
      />
    </Suspense>
  )
}

