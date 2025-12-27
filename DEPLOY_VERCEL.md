# Deploy na Vercel - Configuração Completa

## ✅ Configurações Aplicadas

### 1. Build Command
O `vercel.json` está configurado para executar:
```bash
prisma generate && next build
```

Isso garante que o Prisma Client seja gerado antes do build do Next.js.

### 2. Postinstall Script
O `package.json` inclui:
```json
"postinstall": "prisma generate"
```

Isso garante que o Prisma Client seja gerado automaticamente após `npm install`.

### 3. URL do Banco Hardcoded
A URL do banco está hardcoded no `schema.prisma`, então **não precisa** configurar variáveis de ambiente na Vercel para o banco de dados.

## 🚀 Processo de Deploy

### Passo 1: Push do Código
```bash
git add .
git commit -m "Configure for Vercel"
git push
```

### Passo 2: Build na Vercel
A Vercel vai automaticamente:
1. ✅ Instalar dependências (`npm install`)
2. ✅ Gerar Prisma Client (`prisma generate` via postinstall)
3. ✅ Executar build (`prisma generate && next build`)
4. ✅ Deploy da aplicação

### Passo 3: Executar Migration
**IMPORTANTE:** Após o primeiro deploy, você precisa executar a migration no banco:

**Opção A: Via Prisma CLI localmente**
```bash
# Conectar ao banco de produção e executar migration
npx prisma migrate deploy
```

**Opção B: Executar SQL manualmente**
1. Abra `prisma/migrations/0001_init/migration.sql`
2. Execute o SQL completo no seu PostgreSQL (Railway)

**Opção C: Via Railway Dashboard**
1. Acesse seu projeto no Railway
2. Vá em "Query" ou use o terminal
3. Cole e execute o SQL da migration

### Passo 4: Popular Dados Iniciais
```bash
npm run db:seed
```

Ou execute manualmente as queries de inserção das categorias.

## ⚠️ Importante

### URL do Banco Hardcoded
Como a URL está hardcoded no `schema.prisma`, você **NÃO precisa** configurar variáveis de ambiente na Vercel para `DATABASE_URL`.

### Prisma Client
O Prisma Client será gerado automaticamente durante o build graças ao:
- `postinstall` script no package.json
- `buildCommand` no vercel.json

### Migration
A migration **NÃO** é executada automaticamente. Você precisa executá-la manualmente após o primeiro deploy.

## 🐛 Troubleshooting

### Erro: "Prisma Client not generated"
- Verifique se o `postinstall` está no package.json ✅
- Verifique se o `vercel.json` tem o buildCommand correto ✅

### Erro: "Cannot connect to database"
- Verifique se a URL no schema.prisma está correta ✅
- Verifique se o banco aceita conexões externas (Railway permite por padrão)

### Erro: "Table does not exist"
- Execute a migration manualmente (veja Passo 3 acima)

## ✅ Checklist de Deploy

- [x] Código commitado e pushed
- [x] Build command configurado no vercel.json
- [x] Postinstall script adicionado
- [ ] Migration executada no banco
- [ ] Seed executado (categorias padrão)
- [ ] Aplicação funcionando em produção

## 🎯 Após o Deploy

1. Acesse sua URL da Vercel
2. Verifique se o dashboard carrega
3. Tente criar uma categoria
4. Tente criar uma transação

Se tudo funcionar, o deploy foi bem-sucedido! 🎉

