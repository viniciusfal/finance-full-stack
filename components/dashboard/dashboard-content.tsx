'use client'

import { useState, useEffect, useTransition } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { Tag } from '@/components/ui/tag'
import { ClientLink } from '@/components/ui/client-link'
import { ChevronRight, Plus } from 'lucide-react'
import { SettlementToggle } from '@/components/ui/settlement-toggle'
import { toggleTransactionSettlement } from '@/lib/actions/transactions'
import { useRouter } from 'next/navigation'

interface DashboardContentProps {
  initialData: {
    balance: number
    totalIncome: number
    totalExpense: number
    recentTransactions: Array<{
      id: string
      description: string
      amount: number
      type: 'INCOME' | 'EXPENSE'
      date: Date | string
      settled: boolean
      category?: {
        id: string
        title: string
        color: string
      } | null
    }>
    topCategories: Array<{
      id: string
      title: string
      color: string
      _count: { transactions: number }
    }>
  }
}

export function DashboardContent({ initialData }: DashboardContentProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [mode, setMode] = useState<'all' | 'settled'>('all')
  const [data, setData] = useState(initialData)

  useEffect(() => {
    // Recarregar dados quando o modo mudar
    fetch(`/api/dashboard?mode=${mode}`)
      .then((res) => res.json())
      .then((newData) => {
        setData(newData)
      })
      .catch(() => {
        // Em caso de erro, manter dados iniciais
      })
  }, [mode])

  async function handleToggleSettlement(transactionId: string) {
    const result = await toggleTransactionSettlement(transactionId)
    if (result.success) {
      startTransition(() => {
        router.refresh()
      })
    }
  }

  const filteredTransactions =
    mode === 'settled'
      ? data.recentTransactions.filter((t) => t.settled)
      : data.recentTransactions

  return (
    <div className="mx-auto max-w-7xl px-12 py-12">
      {/* Toggle de Modo */}
      <div className="mb-6 flex justify-end">
        <SettlementToggle mode={mode} onModeChange={setMode} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card Saldo Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {mode === 'settled' ? 'Saldo liquidado' : 'Saldo total'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(data.balance)}
          </p>
        </div>

        {/* Card Receitas */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {mode === 'settled' ? 'Receitas liquidadas' : 'Receitas do mês'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(data.totalIncome)}
          </p>
        </div>

        {/* Card Despesas */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {mode === 'settled' ? 'Despesas liquidadas' : 'Despesas do mês'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(data.totalExpense)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Transações Recentes */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Transações recentes
            </h3>
            <ClientLink href="/transacoes" icon={<ChevronRight className="h-4 w-4" />}>
              Ver todas
            </ClientLink>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredTransactions.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Nenhuma transação encontrada
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-lg ${
                        transaction.type === 'INCOME'
                          ? 'bg-green-light dark:bg-green-900/30'
                          : transaction.category?.color === 'blue'
                          ? 'bg-blue-light dark:bg-blue-900/30'
                          : transaction.category?.color === 'purple'
                          ? 'bg-purple-light dark:bg-purple-900/30'
                          : transaction.category?.color === 'orange'
                          ? 'bg-orange-light dark:bg-orange-900/30'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {transaction.description}
                        </p>
                        {transaction.settled && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Liquidado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {transaction.category && (
                      <Tag
                        label={transaction.category.title}
                        color={(transaction.category.color as any) || 'blue'}
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          transaction.type === 'INCOME'
                            ? 'text-gray-800 dark:text-gray-100'
                            : 'text-gray-800 dark:text-gray-100'
                        }`}
                      >
                        {transaction.type === 'INCOME' ? '+' : '-'}{' '}
                        {formatCurrency(transaction.amount)}
                      </span>
                      {transaction.type === 'INCOME' ? (
                        <ArrowUpCircle className="h-4 w-4 text-green-base dark:text-green-400" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4 text-red-base dark:text-red-400" />
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleSettlement(transaction.id)}
                      className={`rounded-lg p-1 transition-colors ${
                        transaction.settled
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      title={transaction.settled ? 'Marcar como não liquidado' : 'Marcar como liquidado'}
                    >
                      {transaction.settled ? (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center border-t border-gray-200 px-6 py-5 dark:border-gray-800">
            <ClientLink
              href="/transacoes"
              icon={<Plus className="h-4 w-4" />}
              iconPosition="left"
            >
              Nova transação
            </ClientLink>
          </div>
        </div>

        {/* Categorias */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Categorias
            </h3>
            <ClientLink href="/categorias" icon={<ChevronRight className="h-4 w-4" />}>
              Gerenciar
            </ClientLink>
          </div>
          <div className="divide-y divide-gray-200 px-6 py-6 dark:divide-gray-800">
            {data.topCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <Tag
                  label={category.title}
                  color={(category.color as any) || 'blue'}
                />
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {category._count.transactions} itens
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    R$ 0,00
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

