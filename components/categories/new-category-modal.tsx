'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconPicker } from '@/components/ui/icon-picker'
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
  const [isPending, startTransition] = useTransition()
  const [selectedColor, setSelectedColor] = useState('blue')
  const [selectedIcon, setSelectedIcon] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.append('color', selectedColor)
    if (selectedIcon) {
      formData.append('icon', selectedIcon)
    }

    const result = await createCategory(formData)

    if (result.success) {
      // Reset form first
      setSelectedColor('blue')
      setSelectedIcon('')
      ;(e.target as HTMLFormElement).reset()
      onClose()
      
      // Then refresh in a transition
      startTransition(() => {
        router.refresh()
      })
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
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ícone
          </label>
          <IconPicker selectedIcon={selectedIcon} onSelect={setSelectedIcon} />
          {selectedIcon && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ícone selecionado
            </p>
          )}
        </div>

        {/* Seleção de Cor */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Cor
          </label>
          <div className="grid grid-cols-7 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  selectedColor === color.value
                    ? 'border-gray-800 dark:border-gray-200 scale-110'
                    : 'border-gray-300 dark:border-gray-700'
                } ${color.bg}`}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || isPending}>
          {isSubmitting || isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Modal>
  )
}

