import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { Tag } from '@/components/ui/tag'
import { ClientLink } from '@/components/ui/client-link'
import { ChevronRight, Plus } from 'lucide-react'

async function getDashboardData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [transactions, categories] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: {
        transactions: {
          _count: 'desc',
        },
      },
      take: 5,
    }),
  ])

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  return {
    balance,
    totalIncome,
    totalExpense,
    recentTransactions: transactions,
    topCategories: categories,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="mx-auto max-w-7xl px-12 py-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card Saldo Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-gray-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Saldo total
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(data.balance)}
          </p>
        </div>

        {/* Card Receitas */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-gray-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Receitas do mês
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(data.totalIncome)}
          </p>
        </div>

        {/* Card Despesas */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-gray-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Despesas do mês
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(data.totalExpense)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Transações Recentes */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Transações recentes
            </h3>
            <ClientLink href="/transacoes" icon={<ChevronRight className="h-4 w-4" />}>
              Ver todas
            </ClientLink>
          </div>
          <div className="divide-y divide-gray-200">
            {data.recentTransactions.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                Nenhuma transação encontrada
              </div>
            ) : (
              data.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between px-6 py-4"
                >
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
                    <div>
                      <p className="font-medium text-gray-800">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {transaction.category && (
                      <Tag
                        label={transaction.category.title}
                        color={
                          (transaction.category.color as any) || 'blue'
                        }
                      />
                    )}
                    <div className="flex items-center gap-2">
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
                      {transaction.type === 'INCOME' ? (
                        <ArrowUpCircle className="h-4 w-4 text-green-base" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4 text-red-base" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center border-t border-gray-200 px-6 py-5">
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
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Categorias
            </h3>
            <ClientLink href="/categorias" icon={<ChevronRight className="h-4 w-4" />}>
              Gerenciar
            </ClientLink>
          </div>
          <div className="divide-y divide-gray-200 px-6 py-6">
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
                  <span className="text-sm text-gray-600">
                    {category._count.transactions} itens
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
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

