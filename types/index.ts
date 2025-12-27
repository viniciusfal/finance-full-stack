import { Prisma } from '@prisma/client'

export type TransactionWithCategory = Prisma.TransactionGetPayload<{
  include: {
    category: true
    installment: true
  }
}>

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: {
    _count: {
      select: {
        transactions: true
      }
    }
  }
}>

export type InstallmentPlanWithInstallments = Prisma.InstallmentPlanGetPayload<{
  include: {
    installments: {
      include: {
        transaction: true
      }
    }
  }
}>

export type FinancialGoalWithTransactions = Prisma.FinancialGoalGetPayload<{
  include: {
    transactions: true
  }
}>

