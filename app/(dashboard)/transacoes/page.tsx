import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Tag } from '@/components/ui/tag'
import { IconButton } from '@/components/ui/icon-button'
import { Edit, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { TransactionModalWrapper } from '@/components/transactions/transaction-modal-wrapper'
import { DeleteTransactionButton } from '@/components/transactions/delete-transaction-button'

async function getTransactions() {
  return await prisma.transaction.findMany({
    include: {
      category: true,
      installment: {
        include: {
          installmentPlan: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    take: 10,
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      title: 'asc',
    },
  })
}

export default async function TransactionsPage() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ])


  return (
    <div className="mx-auto max-w-7xl px-12 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="mt-1 text-base text-gray-600">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <TransactionModalWrapper
          categories={categories.map((c) => ({
            id: c.id,
            title: c.title,
            color: c.color,
          }))}
        />
      </div>

      {/* Filtros */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por descrição"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>Todos</option>
              <option>Receita</option>
              <option>Despesa</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>Todas</option>
              {categories.map((cat) => (
                <option key={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Período
            </label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>Novembro / 2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Descrição
                </th>
                <th className="px-6 py-5 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Data
                </th>
                <th className="px-6 py-5 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Categoria
                </th>
                <th className="px-6 py-5 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tipo
                </th>
                <th className="px-6 py-5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Valor
                </th>
                <th className="px-6 py-5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    Nenhuma transação encontrada
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-lg ${
                            transaction.type === 'INCOME'
                              ? 'bg-green-light'
                              : transaction.category?.color === 'blue'
                              ? 'bg-blue-light'
                              : transaction.category?.color === 'purple'
                              ? 'bg-purple-light'
                              : transaction.category?.color === 'orange'
                              ? 'bg-orange-light'
                              : 'bg-gray-200'
                          }`}
                        />
                        <span className="font-medium text-gray-800">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {transaction.category ? (
                        <Tag
                          label={transaction.category.title}
                          color={(transaction.category.color as any) || 'blue'}
                        />
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {transaction.type === 'INCOME' ? (
                          <>
                            <ArrowUpCircle className="h-4 w-4 text-green-dark" />
                            <span className="text-sm font-medium text-green-dark">
                              Entrada
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDownCircle className="h-4 w-4 text-red-dark" />
                            <span className="text-sm font-medium text-red-dark">
                              Saída
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          transaction.type === 'INCOME'
                            ? 'text-gray-800'
                            : 'text-gray-800'
                        }`}
                      >
                        {transaction.type === 'INCOME' ? '+' : '-'}{' '}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <IconButton
                          icon={<Edit className="h-4 w-4" />}
                          aria-label="Editar"
                        />
                        <DeleteTransactionButton id={transaction.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-5">
          <span className="text-sm text-gray-700">1 a 10 | {transactions.length} resultados</span>
          <div className="flex gap-2">
            {/* Paginação será implementada depois */}
          </div>
        </div>
      </div>
    </div>
  )
}

