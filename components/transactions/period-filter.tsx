'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { generateAvailablePeriods } from '@/lib/utils'

interface PeriodFilterProps {
  defaultPeriod?: string
}

function PeriodFilterContent({ defaultPeriod }: PeriodFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [periods, setPeriods] = useState<Array<{ label: string; value: string }>>([])
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod || searchParams.get('period') || '')

  const updateURL = useCallback((period: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (period) {
      params.set('period', period)
    } else {
      params.delete('period')
    }
    router.push(`/transacoes?${params.toString()}`)
  }, [searchParams, router])

  useEffect(() => {
    const initialPeriod = defaultPeriod || searchParams.get('period') || ''
    
    // Buscar transações para determinar o range de datas
    fetch('/api/transactions/periods')
      .then((res) => res.json())
      .then((data) => {
        if (data.startDate && data.endDate) {
          const availablePeriods = generateAvailablePeriods(
            new Date(data.startDate),
            new Date(data.endDate)
          )
          setPeriods(availablePeriods.map((p) => ({ label: p.label, value: p.value })))
          
          // Se não houver período selecionado, usar o mais recente
          if (!initialPeriod && availablePeriods.length > 0) {
            const currentPeriod = availablePeriods[0].value
            setSelectedPeriod(currentPeriod)
            updateURL(currentPeriod)
          }
        } else {
          // Se não houver dados, gerar períodos dos últimos 12 meses
          const now = new Date()
          const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
          const availablePeriods = generateAvailablePeriods(startDate, now)
          setPeriods(availablePeriods.map((p) => ({ label: p.label, value: p.value })))
          
          if (!initialPeriod && availablePeriods.length > 0) {
            const currentPeriod = availablePeriods[0].value
            setSelectedPeriod(currentPeriod)
            updateURL(currentPeriod)
          }
        }
      })
      .catch(() => {
        // Fallback: últimos 12 meses
        const now = new Date()
        const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
        const availablePeriods = generateAvailablePeriods(startDate, now)
        setPeriods(availablePeriods.map((p) => ({ label: p.label, value: p.value })))
        
        if (!initialPeriod && availablePeriods.length > 0) {
          const currentPeriod = availablePeriods[0].value
          setSelectedPeriod(currentPeriod)
          updateURL(currentPeriod)
        }
      })
  }, [defaultPeriod, searchParams, updateURL])

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const period = e.target.value
    setSelectedPeriod(period)
    updateURL(period)
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Período
      </label>
      <select
        value={selectedPeriod}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
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

export function PeriodFilter({ defaultPeriod }: PeriodFilterProps) {
  return (
    <Suspense fallback={
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Período
        </label>
        <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
          <option>Carregando...</option>
        </select>
      </div>
    }>
      <PeriodFilterContent defaultPeriod={defaultPeriod} />
    </Suspense>
  )
}

