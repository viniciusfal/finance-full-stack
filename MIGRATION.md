# Instruções para Executar a Migration

## Opção 1: Usando Prisma Migrate (Recomendado)

```bash
# 1. Gerar o cliente Prisma
npm run db:generate

# 2. Executar as migrations
npm run db:migrate

# 3. Popular com dados iniciais (categorias padrão)
npm run db:seed
```

## Opção 2: Executar SQL Manualmente

Se preferir executar o SQL diretamente no PostgreSQL:

1. Conecte-se ao seu banco de dados PostgreSQL (Railway)
2. Execute o conteúdo do arquivo `prisma/migrations/0001_init/migration.sql`
3. Execute o seed manualmente ou use `npm run db:seed`

## Estrutura Criada

A migration cria:

- **7 tabelas principais:**
  - `users` - Usuários (preparado para futura autenticação)
  - `categories` - Categorias de transações
  - `transactions` - Transações financeiras
  - `installment_plans` - Planos de parcelamento
  - `installments` - Parcelas individuais
  - `recurring_transactions` - Transações recorrentes
  - `financial_goals` - Metas financeiras

- **3 enums:**
  - `TransactionType` (INCOME, EXPENSE)
  - `RecurrenceFrequency` (DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, YEARLY)
  - `GoalStatus` (IN_PROGRESS, COMPLETED, EXPIRED)

- **Índices** para otimização de consultas
- **Foreign keys** para integridade referencial

## Verificação

Após executar a migration, você pode verificar se tudo foi criado corretamente:

```sql
-- Listar todas as tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar se as categorias foram criadas
SELECT * FROM categories;
```

