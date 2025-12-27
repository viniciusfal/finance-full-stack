'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NewCategoryModal } from './new-category-modal'

export function CategoryModalWrapper() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        icon={<Plus className="h-4 w-4" />}
        iconPosition="left"
        onClick={() => setIsOpen(true)}
      >
        Nova categoria
      </Button>
      <NewCategoryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

