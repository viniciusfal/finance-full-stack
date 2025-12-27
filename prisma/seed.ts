import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Criar categorias padrão
  const defaultCategories = [
    {
      title: 'Alimentação',
      description: 'Restaurantes, delivery e refeições',
      icon: 'utensils',
      color: 'blue',
    },
    {
      title: 'Transporte',
      description: 'Gasolina, transporte público e viagens',
      icon: 'car-front',
      color: 'purple',
    },
    {
      title: 'Mercado',
      description: 'Compras de supermercado e mantimentos',
      icon: 'shopping-cart',
      color: 'orange',
    },
    {
      title: 'Entretenimento',
      description: 'Cinema, jogos e lazer',
      icon: 'ticket',
      color: 'pink',
    },
    {
      title: 'Utilidades',
      description: 'Energia, água, internet e telefone',
      icon: 'tool-case',
      color: 'yellow',
    },
    {
      title: 'Investimento',
      description: 'Aplicações e retornos financeiros',
      icon: 'piggy-bank',
      color: 'green',
    },
    {
      title: 'Salário',
      description: 'Renda mensal e bonificações',
      icon: 'briefcase-business',
      color: 'green',
    },
    {
      title: 'Saúde',
      description: 'Medicamentos, consultas e exames',
      icon: 'heart-pulse',
      color: 'red',
    },
  ]

  console.log('📁 Criando categorias padrão...')
  for (const category of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: { title: category.title },
    })
    
    if (!existing) {
      await prisma.category.create({
        data: category,
      })
    }
  }

  console.log('✅ Seed concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

