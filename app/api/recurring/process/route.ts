import { NextResponse } from 'next/server'
import { processRecurringTransactions } from '@/lib/actions/recurring-transactions'

export const dynamic = 'force-dynamic'

/**
 * API Route para processar transações recorrentes
 * Pode ser chamada por um cron job (ex: Vercel Cron Jobs)
 * 
 * Para configurar no Vercel:
 * 1. Adicione no vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/recurring/process",
 *     "schedule": "0 0 * * *" // Todo dia à meia-noite
 *   }]
 * }
 */
export async function GET(request: Request) {
  try {
    // Verificar se é uma chamada autorizada (opcional: adicionar autenticação)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const result = await processRecurringTransactions()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao processar transações recorrentes:', error)
    return NextResponse.json(
      { error: 'Erro ao processar transações recorrentes' },
      { status: 500 }
    )
  }
}

