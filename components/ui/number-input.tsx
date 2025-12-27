'use client'

import { InputHTMLAttributes, useRef, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string
  helper?: string
  error?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function NumberInput({
  label,
  helper,
  error,
  value,
  onChange,
  min = 1,
  max = 999,
  className,
  ...props
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value.toString()
    }
  }, [value])

  function handleDecrease() {
    const newValue = Math.max(min, value - 1)
    onChange(newValue)
  }

  function handleIncrease() {
    const newValue = Math.min(max, value + 1)
    onChange(newValue)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value
    
    // Permite campo vazio temporariamente para melhorar UX
    if (inputValue === '') {
      e.target.value = ''
      return
    }

    const numValue = parseInt(inputValue, 10)
    
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue))
      onChange(clampedValue)
      e.target.value = clampedValue.toString()
    } else {
      // Se não for número válido, mantém o valor anterior
      e.target.value = value.toString()
    }
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    // Seleciona todo o texto ao focar para facilitar edição
    e.target.select()
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    // Garante que sempre tenha um valor válido ao perder o foco
    if (e.target.value === '' || isNaN(parseInt(e.target.value, 10))) {
      onChange(min)
      e.target.value = min.toString()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={value <= min || props.disabled}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-l-lg border border-r-0 border-gray-300',
            'bg-white transition-colors',
            'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-base focus:ring-offset-1',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700',
            error && 'border-red-500 focus:ring-red-500'
          )}
          aria-label="Diminuir"
        >
          <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'h-11 w-full border-y border-gray-300 bg-white px-3 text-center text-base',
            'focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={value >= max || props.disabled}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-r-lg border border-l-0 border-gray-300',
            'bg-white transition-colors',
            'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-base focus:ring-offset-1',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700',
            error && 'border-red-500 focus:ring-red-500'
          )}
          aria-label="Aumentar"
        >
          <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      {helper && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helper}</p>
      )}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
}

