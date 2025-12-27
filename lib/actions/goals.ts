'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { toCents } from '@/lib/utils'

export async function createGoal(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const targetAmount = parseFloat(formData.get('targetAmount') as string)
    const targetDate = new Date(formData.get('targetDate') as string)

    await prisma.financialGoal.create({
      data: {
        title,
        description: description || undefined,
        targetAmount: toCents(targetAmount),
        targetDate,
      },
    })

    revalidatePath('/metas')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar meta:', error)
    return { success: false, error: 'Erro ao criar meta' }
  }
}

export async function deleteGoal(id: string) {
  try {
    await prisma.financialGoal.delete({
      where: { id },
    })

    revalidatePath('/metas')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar meta:', error)
    return { success: false, error: 'Erro ao deletar meta' }
  }
}

