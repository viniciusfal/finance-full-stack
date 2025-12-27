import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatação de valores monetários
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100) // Converte de centavos para reais
}

// Formatação de datas
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

// Converte valor em reais para centavos
export function toCents(value: number): number {
  return Math.round(value * 100)
}

// Converte centavos para reais
export function fromCents(cents: number): number {
  return cents / 100
}

// Gera lista de períodos (mês/ano) disponíveis
export function generateAvailablePeriods(startDate: Date, endDate: Date): Array<{ label: string; value: string; year: number; month: number }> {
  const periods: Array<{ label: string; value: string; year: number; month: number }> = []
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

  while (current <= end) {
    const month = current.getMonth() + 1
    const year = current.getFullYear()
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    
    periods.push({
      label: `${monthNames[month - 1]} / ${year}`,
      value: `${year}-${String(month).padStart(2, '0')}`,
      year,
      month,
    })

    current.setMonth(current.getMonth() + 1)
  }

  return periods.reverse() // Mais recentes primeiro
}

// Formata período para exibição
export function formatPeriod(year: number, month: number): string {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return `${monthNames[month - 1]} / ${year}`
}

