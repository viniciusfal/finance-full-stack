'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NewTransactionModal } from './new-transaction-modal'

interface TransactionModalWrapperProps {
  categories: Array<{ id: string; title: string; color: string }>
}

export function TransactionModalWrapper({ categories }: TransactionModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        icon={<Plus className="h-4 w-4" />}
        iconPosition="left"
        onClick={() => setIsOpen(true)}
      >
        Nova transação
      </Button>
      <NewTransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        categories={categories}
      />
    </>
  )
}

