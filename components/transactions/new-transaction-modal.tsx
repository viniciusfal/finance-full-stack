'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import { Button } from '@/components/ui/button'
import { createTransaction } from '@/lib/actions/transactions'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface NewTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Array<{ id: string; title: string; color: string }>
}

export function NewTransactionModal({
  isOpen,
  onClose,
  categories,
}: NewTransactionModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
  const [installments, setInstallments] = useState(1)
  const [isRecurring, setIsRecurring] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append('type', type)
    formData.append('installments', installments.toString())
    formData.append('isRecurring', isRecurring.toString())

    const result = await createTransaction(formData)

    if (result.success) {
      // Reset form first
      setType('EXPENSE')
      setInstallments(1)
      setIsRecurring(false)
      ;(e.target as HTMLFormElement).reset()
      onClose()
      
      // Then refresh in a transition
      startTransition(() => {
        router.refresh()
      })
    }

    setIsSubmitting(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova transação"
      subtitle="Registre sua despesa ou receita"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Toggle Despesa/Receita */}
        <div className="flex gap-2 rounded-xl border border-gray-200 p-2">
          <button
            type="button"
            onClick={() => {
              setType('EXPENSE')
            }}
            className={`flex flex-1 items-center justify-center gap-3 rounded-lg px-3 py-3.5 transition-colors ${
              type === 'EXPENSE'
                ? 'bg-gray-100 border border-red-base'
                : 'bg-transparent'
            }`}
          >
            <ArrowDownCircle
              className={`h-5 w-5 ${
                type === 'EXPENSE' ? 'text-gray-800' : 'text-gray-600'
              }`}
            />
            <span
              className={`text-base ${
                type === 'EXPENSE'
                  ? 'font-medium text-gray-800'
                  : 'font-normal text-gray-600'
              }`}
            >
              Despesa
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setType('INCOME')
              setIsRecurring(false) // Despesa fixa só funciona para despesas
            }}
            className={`flex flex-1 items-center justify-center gap-3 rounded-lg px-3 py-3.5 transition-colors ${
              type === 'INCOME'
                ? 'bg-gray-100'
                : 'bg-transparent'
            }`}
          >
            <ArrowUpCircle
              className={`h-5 w-5 ${
                type === 'INCOME' ? 'text-gray-800' : 'text-gray-600'
              }`}
            />
            <span
              className={`text-base ${
                type === 'INCOME'
                  ? 'font-medium text-gray-800'
                  : 'font-normal text-gray-600'
              }`}
            >
              Receita
            </span>
          </button>
        </div>

        {/* Descrição */}
        <Input
          name="description"
          label="Descrição"
          placeholder="Ex. Almoço no restaurante"
          required
        />

        {/* Data e Valor */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="date"
            label="Data"
            type="date"
            defaultValue={format(new Date(), 'yyyy-MM-dd')}
            required
          />
          <Input
            name="amount"
            label="Valor"
            type="number"
            step="0.01"
            placeholder="0,00"
            required
          />
        </div>

        {/* Parcelas - Desabilitado se for despesa fixa */}
        {!isRecurring && (
          <>
            <NumberInput
              label="Número de Parcelas"
              value={installments}
              onChange={setInstallments}
              min={1}
              max={120}
              helper={
                installments > 1
                  ? `Serão criadas ${installments} parcelas com intervalo de 30 dias`
                  : undefined
              }
            />
            <input type="hidden" name="installments" value={installments} />
          </>
        )}
        {isRecurring && <input type="hidden" name="installments" value="1" />}

        {/* Categoria */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Categoria
          </label>
          <select
            name="categoryId"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-brand-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {/* Despesa Fixa - Apenas para despesas */}
        {type === 'EXPENSE' && (
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-base focus:ring-2 focus:ring-brand-base dark:border-gray-600 dark:bg-gray-800"
            />
            <label
              htmlFor="isRecurring"
              className="flex-1 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Despesa Fixa
            </label>
            {isRecurring && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Esta despesa será criada automaticamente todo mês na mesma data
              </span>
            )}
          </div>
        )}

        {/* Botão Salvar */}
        <Button type="submit" className="w-full" disabled={isSubmitting || isPending}>
          {isSubmitting || isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Modal>
  )
}

