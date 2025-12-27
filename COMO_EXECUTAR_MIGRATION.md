# Como Executar a Migration - Passo a Passo

## 🎯 Opção 1: Usando Prisma CLI (Recomendado) ✅

### Passo 1: Gerar o Cliente Prisma
```bash
npm run db:generate
```
✅ **Já executado com sucesso!** O cliente Prisma foi gerado.

### Passo 2: Executar a Migration
```bash
npm run db:migrate
```
Isso vai:
- Criar todas as tabelas no banco
- Criar os enums (TransactionType, RecurrenceFrequency, GoalStatus)
- Criar índices e foreign keys
- Criar constraints (unique, etc.)

**O que acontece:**
- O Prisma vai perguntar o nome da migration (pode usar: `init`)
- Vai executar o SQL no banco de dados
- Vai criar um histórico de migrations

### Passo 3: Popular com Dados Iniciais (Opcional)
```bash
npm run db:seed
```
Isso cria as categorias padrão (Alimentação, Transporte, Mercado, etc.)

---

## 🎯 Opção 2: Executar SQL Manualmente

Se preferir executar o SQL diretamente no PostgreSQL:

### Passo 1: Conectar ao Banco
Você pode usar:
- **pgAdmin** (interface gráfica)
- **DBeaver** (interface gráfica)  
- **psql** (linha de comando)
- **Railway Dashboard** (se estiver usando Railway)
- **DBeaver** ou qualquer cliente PostgreSQL

### Passo 2: Copiar o SQL
Abra o arquivo: `prisma/migrations/0001_init/migration.sql`

### Passo 3: Executar o SQL
Cole **TODO** o conteúdo do arquivo e execute no seu cliente PostgreSQL.

### Passo 4: Verificar se Funcionou
Execute esta query para ver todas as tabelas criadas:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Você deve ver:
- ✅ categories
- ✅ financial_goals
- ✅ installment_plans
- ✅ installments
- ✅ recurring_transactions
- ✅ transactions
- ✅ users

---

## 🎯 Opção 3: Usando Prisma DB Push (Alternativa Rápida)

Se a migration não funcionar, você pode usar:

```bash
npm run db:push
```

Isso sincroniza o schema diretamente com o banco (sem criar histórico de migrations).

⚠️ **Atenção:** Use apenas em desenvolvimento. Em produção, prefira migrations.

---

## ✅ Verificação

Após executar a migration, teste se está funcionando:

```bash
# Iniciar o servidor
npm run dev
```

Acesse http://localhost:3000 e tente:
1. ✅ Ver o dashboard (deve carregar sem erros)
2. ✅ Criar uma categoria
3. ✅ Criar uma transação

Se tudo funcionar, a migration foi executada com sucesso! 🎉

---

## 🐛 Problemas Comuns

### Erro: "Database does not exist"
- Verifique se a URL do banco está correta no `schema.prisma`
- Verifique se o banco está acessível
- Teste a conexão manualmente

### Erro: "Permission denied"
- Verifique se o usuário tem permissão para criar tabelas
- No Railway, geralmente já vem com todas as permissões

### Erro: "Table already exists"
- As tabelas já foram criadas anteriormente
- Você pode ignorar ou dropar as tabelas e executar novamente

### Para resetar tudo (CUIDADO - apaga todos os dados):
```bash
npx prisma migrate reset
```

---

## 📋 Resumo Rápido - Execute Agora!

**Método mais simples (recomendado):**
```bash
# 1. Gerar cliente (já feito ✅)
npm run db:generate

# 2. Executar migration
npm run db:migrate

# 3. Popular dados iniciais
npm run db:seed

# 4. Iniciar servidor
npm run dev
```

**Ou execute SQL manualmente:**
1. Abra `prisma/migrations/0001_init/migration.sql`
2. Copie todo o conteúdo
3. Execute no seu cliente PostgreSQL
4. Execute `npm run db:seed` para popular categorias

---

## 🎯 Próximo Passo

Depois de executar a migration, você pode:
- ✅ Acessar http://localhost:3000
- ✅ Ver o dashboard funcionando
- ✅ Criar transações e categorias
- ✅ Testar o sistema de parcelamento

Pronto! Suas tabelas estarão criadas e o sistema funcionando! 🚀
