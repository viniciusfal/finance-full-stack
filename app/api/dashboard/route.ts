import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') || 'all'
    const period = searchParams.get('period')

    let startOfMonth: Date
    let endOfMonth: Date

    if (period) {
      // Formato: YYYY-MM
      const [year, month] = period.split('-').map(Number)
      startOfMonth = new Date(year, month - 1, 1)
      endOfMonth = new Date(year, month, 0, 23, 59, 59)
    } else {
      // Usar mês atual como padrão
      const now = new Date()
      startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    }

    const where: any = {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    }

    if (mode === 'settled') {
      where.settled = true
    }

    const [transactions, categories] = await Promise.all([
      prisma.transaction.findMany({
        where,
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
          transactions: {
            where: {
              date: {
                gte: startOfMonth,
                lte: endOfMonth,
              },
            },
          },
        },
      }),
    ])

    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpense

    // Filtrar e ordenar categorias por número de transações no período
    const topCategories = categories
      .map((category) => ({
        ...category,
        _count: {
          transactions: category.transactions.length,
        },
      }))
      .filter((category) => category._count.transactions > 0)
      .sort((a, b) => b._count.transactions - a._count.transactions)
      .slice(0, 5)
      .map(({ transactions, ...category }) => category)

    return NextResponse.json({
      balance,
      totalIncome,
      totalExpense,
      recentTransactions: transactions.map((t) => ({
        ...t,
        date: t.date.toISOString(),
      })),
      topCategories,
    })
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    )
  }
}

