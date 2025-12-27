import { prisma } from '@/lib/prisma'
import { Tag } from '@/components/ui/tag'
import { CategoryModalWrapper } from '@/components/categories/category-modal-wrapper'

async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
    orderBy: {
      title: 'asc',
    },
  })
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  const totalCategories = categories.length
  const totalTransactions = categories.reduce(
    (sum, cat) => sum + cat._count.transactions,
    0
  )
  const mostUsedCategory = categories.reduce(
    (prev, current) =>
      current._count.transactions > prev._count.transactions ? current : prev,
    categories[0] || { title: 'Nenhuma', _count: { transactions: 0 } }
  )

  return (
    <div className="mx-auto max-w-7xl px-12 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="mt-1 text-base text-gray-600">
            Organize suas transações por categorias
          </p>
        </div>
        <CategoryModalWrapper />
      </div>

      {/* Cards de Estatísticas */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 h-8 w-8 rounded-lg bg-gray-200" />
          <div>
            <p className="text-3xl font-bold text-gray-800">{totalCategories}</p>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              total de categorias
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 h-8 w-8 rounded-lg bg-gray-200" />
          <div>
            <p className="text-3xl font-bold text-gray-800">{totalTransactions}</p>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              total de transações
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 h-8 w-8 rounded-lg bg-gray-200" />
          <div>
            <p className="text-3xl font-bold text-gray-800">
              {mostUsedCategory.title}
            </p>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              categoria mais utilizada
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="mb-4 h-12 w-12 rounded-lg bg-gray-200" />
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {category.title}
              </h3>
              {category.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {category.description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Tag
                label={category.title}
                color={(category.color as any) || 'blue'}
              />
              <span className="text-sm text-gray-600">
                {category._count.transactions} itens
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

