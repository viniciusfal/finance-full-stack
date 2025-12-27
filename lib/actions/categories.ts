'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const icon = formData.get('icon') as string | null
    const color = formData.get('color') as string

    await prisma.category.create({
      data: {
        title,
        description: description || undefined,
        icon: icon || undefined,
        color,
      },
    })

    // Revalidar todas as rotas que podem mostrar categorias
    revalidatePath('/categorias', 'page')
    revalidatePath('/', 'layout')
    revalidatePath('/transacoes', 'page')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return { success: false, error: 'Erro ao criar categoria' }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    })

    // Revalidar todas as rotas que podem mostrar categorias
    revalidatePath('/categorias', 'page')
    revalidatePath('/', 'layout')
    revalidatePath('/transacoes', 'page')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar categoria:', error)
    return { success: false, error: 'Erro ao deletar categoria' }
  }
}

