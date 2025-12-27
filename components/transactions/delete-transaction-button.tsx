'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'
import { deleteTransaction } from '@/lib/actions/transactions'

interface DeleteTransactionButtonProps {
  id: string
}

export function DeleteTransactionButton({ id }: DeleteTransactionButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      const result = await deleteTransaction(id)
      if (result.success) {
        startTransition(() => {
          router.refresh()
        })
      }
    }
  }

  return (
    <IconButton
      onClick={handleDelete}
      variant="danger"
      icon={<Trash2 className="h-4 w-4" />}
      aria-label="Excluir"
      disabled={isPending}
    />
  )
}

