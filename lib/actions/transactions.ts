'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { toCents } from '@/lib/utils'
import { addDays } from 'date-fns'

export async function createTransaction(formData: FormData) {
  try {
    const description = formData.get('description') as string
    const amount = parseFloat(formData.get('amount') as string)
    const type = formData.get('type') as 'INCOME' | 'EXPENSE'
    const date = new Date(formData.get('date') as string)
    const categoryId = formData.get('categoryId') as string | null
    const installments = parseInt(formData.get('installments') as string) || 1

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

    revalidatePath('/')
    revalidatePath('/transacoes')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar transação:', error)
    return { success: false, error: 'Erro ao criar transação' }
  }
}

export async function deleteTransaction(id: string) {
  try {
    await prisma.transaction.delete({
      where: { id },
    })

    revalidatePath('/')
    revalidatePath('/transacoes')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar transação:', error)
    return { success: false, error: 'Erro ao deletar transação' }
  }
}

