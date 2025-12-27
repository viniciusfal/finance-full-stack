import { prisma } from '@/lib/prisma'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

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

  return <DashboardContent initialData={data} />
}

