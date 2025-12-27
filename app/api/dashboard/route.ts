import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') || 'all'

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

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

    return NextResponse.json({
      balance,
      totalIncome,
      totalExpense,
      recentTransactions: transactions.map((t) => ({
        ...t,
        date: t.date.toISOString(),
      })),
      topCategories: categories,
    })
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    )
  }
}

