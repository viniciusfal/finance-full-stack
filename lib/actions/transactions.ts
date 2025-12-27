'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { toCents } from '@/lib/utils'
import { addDays, addMonths } from 'date-fns'

export async function createTransaction(formData: FormData) {
  try {
    const description = formData.get('description') as string
    const amount = parseFloat(formData.get('amount') as string)
    const type = formData.get('type') as 'INCOME' | 'EXPENSE'
    const date = new Date(formData.get('date') as string)
    const categoryId = formData.get('categoryId') as string | null
    const installments = parseInt(formData.get('installments') as string) || 1
    const isRecurring = formData.get('isRecurring') === 'true'

    // Se for despesa fixa recorrente, criar RecurringTransaction
    if (isRecurring && type === 'EXPENSE') {
      const dayOfMonth = date.getDate()
      const nextDueDate = addMonths(date, 1)
      nextDueDate.setDate(dayOfMonth)

      await prisma.recurringTransaction.create({
        data: {
          description,
          amount: toCents(amount),
          type: 'EXPENSE',
          categoryId: categoryId || undefined,
          frequency: 'MONTHLY',
          startDate: date,
          nextDueDate,
          active: true,
        },
      })

      // Criar a primeira transação do mês atual
      await prisma.transaction.create({
        data: {
          description,
          amount: toCents(amount),
          type: 'EXPENSE',
          date,
          categoryId: categoryId || undefined,
        },
      })

      // Revalidar todas as rotas que podem mostrar transações
      revalidatePath('/', 'layout')
      revalidatePath('/transacoes', 'page')
      return { success: true }
    }

    if (installments > 1) {
      // Criar plano de parcelamento
      const totalAmount = toCents(amount)
      const installmentAmount = Math.floor(totalAmount / installments)
      const remainder = totalAmount - installmentAmount * installments

      const installmentPlan = await prisma.installmentPlan.create({
        data: {
          description,
          totalAmount,
          numberOfInstallments: installments,
          firstDueDate: date,
        },
      })

      // Criar parcelas
      const installmentsData = []
      for (let i = 0; i < installments; i++) {
        const dueDate = addDays(date, i * 30)
        const amount = i === installments - 1 
          ? installmentAmount + remainder // Última parcela recebe o resto
          : installmentAmount

        installmentsData.push({
          installmentPlanId: installmentPlan.id,
          number: i + 1,
          amount,
          dueDate,
        })
      }

      await prisma.installment.createMany({
        data: installmentsData,
      })

      // Criar primeira transação vinculada à primeira parcela
      const firstInstallment = await prisma.installment.findFirst({
        where: { installmentPlanId: installmentPlan.id, number: 1 },
      })

      if (firstInstallment) {
        await prisma.transaction.create({
          data: {
            description: `${description} (1/${installments})`,
            amount: firstInstallment.amount,
            type,
            date: firstInstallment.dueDate,
            categoryId: categoryId || undefined,
            installmentId: firstInstallment.id,
          },
        })
      }
    } else {
      // Transação simples
      await prisma.transaction.create({
        data: {
          description,
          amount: toCents(amount),
          type,
          date,
          categoryId: categoryId || undefined,
        },
      })
    }

    // Revalidar todas as rotas que podem mostrar transações
    revalidatePath('/', 'layout')
    revalidatePath('/transacoes', 'page')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar transação:', error)
    return { success: false, error: 'Erro ao criar transação' }
  }
}

export async function updateTransaction(id: string, formData: FormData) {
  try {
    const description = formData.get('description') as string
    const amount = parseFloat(formData.get('amount') as string)
    const type = formData.get('type') as 'INCOME' | 'EXPENSE'
    const date = new Date(formData.get('date') as string)
    const categoryId = formData.get('categoryId') as string | null

    await prisma.transaction.update({
      where: { id },
      data: {
        description,
        amount: toCents(amount),
        type,
        date,
        categoryId: categoryId || null,
      },
    })

    // Revalidar todas as rotas que podem mostrar transações
    revalidatePath('/', 'layout')
    revalidatePath('/transacoes', 'page')
    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar transação:', error)
    return { success: false, error: 'Erro ao atualizar transação' }
  }
}

export async function deleteTransaction(id: string) {
  try {
    await prisma.transaction.delete({
      where: { id },
    })

    // Revalidar todas as rotas que podem mostrar transações
    revalidatePath('/', 'layout')
    revalidatePath('/transacoes', 'page')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar transação:', error)
    return { success: false, error: 'Erro ao deletar transação' }
  }
}

export async function getTransaction(id: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })
    return transaction
  } catch (error) {
    console.error('Erro ao buscar transação:', error)
    return null
  }
}

export async function toggleTransactionSettlement(id: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      select: { settled: true },
    })

    if (!transaction) {
      return { success: false, error: 'Transação não encontrada' }
    }

    await prisma.transaction.update({
      where: { id },
      data: {
        settled: !transaction.settled,
      },
    })

    // Revalidar todas as rotas que podem mostrar transações
    revalidatePath('/', 'layout')
    revalidatePath('/transacoes', 'page')
    return { success: true }
  } catch (error) {
    console.error('Erro ao alternar liquidação:', error)
    return { success: false, error: 'Erro ao alternar liquidação' }
  }
}

