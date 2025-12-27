'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createCategory } from '@/lib/actions/categories'
import { useRouter } from 'next/navigation'

interface NewCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

const colors: Array<{ name: string; value: string; bg: string }> = [
  { name: 'Azul', value: 'blue', bg: 'bg-blue-light' },
  { name: 'Roxo', value: 'purple', bg: 'bg-purple-light' },
  { name: 'Laranja', value: 'orange', bg: 'bg-orange-light' },
  { name: 'Verde', value: 'green', bg: 'bg-green-light' },
  { name: 'Rosa', value: 'pink', bg: 'bg-pink-light' },
  { name: 'Amarelo', value: 'yellow', bg: 'bg-yellow-light' },
  { name: 'Vermelho', value: 'red', bg: 'bg-red-light' },
]

export function NewCategoryModal({ isOpen, onClose }: NewCategoryModalProps) {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState('blue')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append('color', selectedColor)

    const result = await createCategory(formData)

    if (result.success) {
      router.refresh()
      onClose()
      setSelectedColor('blue')
      ;(e.target as HTMLFormElement).reset()
    }

    setIsSubmitting(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova categoria"
      subtitle="Organize suas transações com categorias"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          name="title"
          label="Título"
          placeholder="Ex. Alimentação"
          required
        />

        <Input
          name="description"
          label="Descrição"
          placeholder="Descrição da categoria"
          helper="Opcional"
        />

        {/* Seleção de Ícone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ícone</label>
          <div className="grid grid-cols-8 gap-2 rounded-lg border border-gray-300 p-4">
            {/* Placeholder para ícones - será implementado depois */}
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </div>

        {/* Seleção de Cor */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Cor</label>
          <div className="grid grid-cols-7 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  selectedColor === color.value
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-300'
                } ${color.bg}`}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Modal>
  )
}

