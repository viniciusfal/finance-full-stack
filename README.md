# Financy - Gerenciador Financeiro

Aplicação financeira completa construída com Next.js 14 (App Router) e PostgreSQL.

## Funcionalidades

- ✅ Dashboard com resumo financeiro
- ✅ Gestão de transações (receitas e despesas)
- ✅ Sistema de parcelamento automático (30 dias de intervalo)
- ✅ Gestão de categorias personalizadas
- ✅ Metas financeiras
- ✅ Transações recorrentes (em desenvolvimento)

## Tecnologias

- **Next.js 14** (App Router com SSR)
- **Prisma ORM**
- **PostgreSQL** (Railway)
- **Tailwind CSS**
- **TypeScript**
- **Lucide React** (ícones)

## Setup

1. Instale as dependências:
```bash
npm install
```

2. Configure o banco de dados:
```bash
# Gerar o cliente Prisma
npm run db:generate

# Executar migrations (ou usar o SQL fornecido)
npm run db:migrate

# Popular com dados iniciais
npm run db:seed
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Migration SQL

O arquivo `prisma/migrations/0001_init/migration.sql` contém toda a estrutura do banco de dados. Você pode executá-lo diretamente no seu PostgreSQL.

## Estrutura do Banco

- **users** - Usuários (preparado para futura autenticação)
- **categories** - Categorias de transações
- **transactions** - Transações financeiras
- **installment_plans** - Planos de parcelamento
- **installments** - Parcelas individuais
- **recurring_transactions** - Transações recorrentes
- **financial_goals** - Metas financeiras

