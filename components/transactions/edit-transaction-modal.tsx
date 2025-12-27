'use client'

import { useState, useEffect, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateTransaction, getTransaction } from '@/lib/actions/transactions'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface EditTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transactionId: string
  categories: Array<{ id: string; title: string; color: string }>
}

export function EditTransactionModal({
  isOpen,
  onClose,
  transactionId,
  categories,
}: EditTransactionModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    categoryId: '',
  })

  useEffect(() => {
    if (isOpen && transactionId) {
      loadTransaction()
    }
  }, [isOpen, transactionId])

  async function loadTransaction() {
    setIsLoading(true)
    const transaction = await getTransaction(transactionId)
    if (transaction) {
      setType(transaction.type)
      setFormData({
        description: transaction.description,
        amount: (transaction.amount / 100).toFixed(2),
        date: format(new Date(transaction.date), 'yyyy-MM-dd'),
        categoryId: transaction.categoryId || '',
      })
    }
    setIsLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const form = new FormData(e.currentTarget)
    form.append('type', type)

    const result = await updateTransaction(transactionId, form)

    if (result.success) {
      onClose()
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
      title="Editar transação"
      subtitle="Atualize os dados da transação"
    >
      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Carregando...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Toggle Despesa/Receita */}
          <div className="flex gap-2 rounded-xl border border-gray-200 p-2 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`flex flex-1 items-center justify-center gap-3 rounded-lg px-3 py-3.5 transition-colors ${
                type === 'EXPENSE'
                  ? 'bg-gray-100 border border-red-base dark:bg-gray-800 dark:border-red-500'
                  : 'bg-transparent'
              }`}
            >
              <ArrowDownCircle
                className={`h-5 w-5 ${
                  type === 'EXPENSE'
                    ? 'text-gray-800 dark:text-gray-200'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              />
              <span
                className={`text-base ${
                  type === 'EXPENSE'
                    ? 'font-medium text-gray-800 dark:text-gray-200'
                    : 'font-normal text-gray-600 dark:text-gray-400'
                }`}
              >
                Despesa
              </span>
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`flex flex-1 items-center justify-center gap-3 rounded-lg px-3 py-3.5 transition-colors ${
                type === 'INCOME'
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'bg-transparent'
              }`}
            >
              <ArrowUpCircle
                className={`h-5 w-5 ${
                  type === 'INCOME'
                    ? 'text-gray-800 dark:text-gray-200'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              />
              <span
                className={`text-base ${
                  type === 'INCOME'
                    ? 'font-medium text-gray-800 dark:text-gray-200'
                    : 'font-normal text-gray-600 dark:text-gray-400'
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
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          {/* Data e Valor */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="date"
              label="Data"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              name="amount"
              label="Valor"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoria
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
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

          {/* Botão Salvar */}
          <Button type="submit" className="w-full" disabled={isSubmitting || isPending}>
            {isSubmitting || isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      )}
    </Modal>
  )
}

