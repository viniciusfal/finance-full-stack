import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

async function getGoals() {
  return await prisma.financialGoal.findMany({
    include: {
      transactions: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function GoalsPage() {
  const goals = await getGoals()

  return (
    <div className="mx-auto max-w-7xl px-12 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Metas Financeiras</h1>
          <p className="mt-1 text-base text-gray-600">
            Acompanhe suas metas e objetivos financeiros
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} iconPosition="left">
          Nova meta
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <div className="col-span-full rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">Nenhuma meta cadastrada</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100
            const isCompleted = goal.status === 'COMPLETED'
            const isExpired = goal.status === 'EXPIRED'

            return (
              <div
                key={goal.id}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
                {goal.description && (
                  <p className="mt-1 text-sm text-gray-600">{goal.description}</p>
                )}

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-semibold text-gray-800">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full transition-all ${
                        isCompleted
                          ? 'bg-green-base'
                          : isExpired
                          ? 'bg-red-base'
                          : 'bg-brand-base'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>Prazo: {formatDate(goal.targetDate)}</p>
                  <p className="mt-1">
                    Status:{' '}
                    <span
                      className={`font-medium ${
                        isCompleted
                          ? 'text-green-dark'
                          : isExpired
                          ? 'text-red-dark'
                          : 'text-brand-base'
                      }`}
                    >
                      {goal.status === 'COMPLETED'
                        ? 'Concluída'
                        : goal.status === 'EXPIRED'
                        ? 'Expirada'
                        : 'Em progresso'}
                    </span>
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

