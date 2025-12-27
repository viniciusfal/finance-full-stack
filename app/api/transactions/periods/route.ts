import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [firstTransaction, lastTransaction] = await Promise.all([
      prisma.transaction.findFirst({
        orderBy: { date: 'asc' },
        select: { date: true },
      }),
      prisma.transaction.findFirst({
        orderBy: { date: 'desc' },
        select: { date: true },
      }),
    ])

    if (!firstTransaction || !lastTransaction) {
      // Se não houver transações, retornar range dos últimos 12 meses
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
      return NextResponse.json({
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
      })
    }

    return NextResponse.json({
      startDate: firstTransaction.date.toISOString(),
      endDate: lastTransaction.date.toISOString(),
    })
  } catch (error) {
    console.error('Erro ao buscar períodos:', error)
    // Fallback: últimos 12 meses
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
    return NextResponse.json({
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
    })
  }
}

