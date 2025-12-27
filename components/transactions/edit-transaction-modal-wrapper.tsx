'use client'

import { useState } from 'react'
import { EditTransactionModal } from './edit-transaction-modal'

interface EditTransactionModalWrapperProps {
  transactionId: string
  categories: Array<{ id: string; title: string; color: string }>
}

export function EditTransactionModalWrapper({
  transactionId,
  categories,
}: EditTransactionModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Editar transação"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
      <EditTransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        transactionId={transactionId}
        categories={categories}
      />
    </>
  )
}

