'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { addMonths, startOfDay, isBefore } from 'date-fns'

/**
 * Processa transações recorrentes que estão vencidas
 * Gera transações para todas as despesas fixas que devem ser criadas
 */
export async function processRecurringTransactions() {
  try {
    const now = startOfDay(new Date())
    
    // Buscar todas as transações recorrentes ativas que estão vencidas
    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: {
        active: true,
        nextDueDate: {
          lte: now,
        },
      },
      include: {
        category: true,
      },
    })

    const createdTransactions = []

    for (const recurring of recurringTransactions) {
      // Verificar se já existe uma transação para esta data
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          description: recurring.description,
          date: {
            gte: startOfDay(recurring.nextDueDate),
            lt: addMonths(startOfDay(recurring.nextDueDate), 1),
          },
          categoryId: recurring.categoryId,
        },
      })

      // Se não existe, criar a transação
      if (!existingTransaction) {
        const transaction = await prisma.transaction.create({
          data: {
            description: recurring.description,
            amount: recurring.amount,
            type: recurring.type,
            date: recurring.nextDueDate,
            categoryId: recurring.categoryId || undefined,
          },
        })

        createdTransactions.push(transaction)

        // Atualizar nextDueDate para o próximo mês
        const dayOfMonth = recurring.nextDueDate.getDate()
        const nextDueDate = addMonths(recurring.nextDueDate, 1)
        nextDueDate.setDate(dayOfMonth)

        // Verificar se há endDate e se já passou
        if (recurring.endDate && isBefore(nextDueDate, recurring.endDate)) {
          await prisma.recurringTransaction.update({
            where: { id: recurring.id },
            data: { nextDueDate },
          })
        } else if (!recurring.endDate) {
          // Se não há endDate, atualizar nextDueDate
          await prisma.recurringTransaction.update({
            where: { id: recurring.id },
            data: { nextDueDate },
          })
        } else {
          // Se chegou ao endDate, desativar
          await prisma.recurringTransaction.update({
            where: { id: recurring.id },
            data: { active: false },
          })
        }
      } else {
        // Se já existe, apenas atualizar nextDueDate
        const dayOfMonth = recurring.nextDueDate.getDate()
        const nextDueDate = addMonths(recurring.nextDueDate, 1)
        nextDueDate.setDate(dayOfMonth)

        if (!recurring.endDate || isBefore(recurring.endDate, nextDueDate)) {
          await prisma.recurringTransaction.update({
            where: { id: recurring.id },
            data: { nextDueDate },
          })
        } else {
          await prisma.recurringTransaction.update({
            where: { id: recurring.id },
            data: { active: false },
          })
        }
      }
    }

    // Revalidar rotas
    revalidatePath('/', 'layout')
    revalidatePath('/transacoes', 'page')

    return {
      success: true,
      processed: recurringTransactions.length,
      created: createdTransactions.length,
    }
  } catch (error) {
    console.error('Erro ao processar transações recorrentes:', error)
    return {
      success: false,
      error: 'Erro ao processar transações recorrentes',
    }
  }
}

