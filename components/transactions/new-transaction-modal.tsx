'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
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
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
  const [installments, setInstallments] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append('type', type)
    formData.append('installments', installments.toString())

    const result = await createTransaction(formData)

    if (result.success) {
      router.refresh()
      onClose()
      setType('EXPENSE')
      setInstallments(1)
      ;(e.target as HTMLFormElement).reset()
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
            onClick={() => setType('EXPENSE')}
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
            onClick={() => setType('INCOME')}
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

        {/* Parcelas */}
        <Input
          name="installments"
          label="Número de Parcelas"
          type="number"
          min="1"
          value={installments}
          onChange={(e) => setInstallments(parseInt(e.target.value) || 1)}
          helper={
            installments > 1
              ? `Serão criadas ${installments} parcelas com intervalo de 30 dias`
              : undefined
          }
        />

        {/* Categoria */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Categoria</label>
          <select
            name="categoryId"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-brand-base"
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Modal>
  )
}

