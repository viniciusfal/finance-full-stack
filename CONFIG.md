# Configuração do Projeto

## Banco de Dados

✅ **URL hardcoded no schema.prisma** conforme solicitado:
```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://postgres:fuTjLCHygdFJTpRARveKdgGtkwFOzpgc@mainline.proxy.rlwy.net:18337/railway"
}
```

A conexão está configurada diretamente no arquivo `prisma/schema.prisma` e não depende de variáveis de ambiente.

## HTTP Client

✅ **Não utiliza axios** - O projeto usa:
- **Server Actions** do Next.js 14 para comunicação servidor-cliente
- **Prisma Client** para acesso ao banco de dados
- **Fetch nativo** do JavaScript (se necessário no futuro)

### Por que não precisa de axios?

1. **Server Actions**: Next.js 14 permite criar funções assíncronas que rodam no servidor e podem ser chamadas diretamente dos componentes React, sem necessidade de API routes ou axios.

2. **Prisma Client**: Todas as operações de banco de dados são feitas diretamente via Prisma, que gerencia as conexões internamente.

3. **SSR**: Como estamos usando Server Components, os dados são buscados diretamente no servidor durante o render.

### Se precisar usar axios no futuro:

Caso você precise fazer chamadas HTTP externas (APIs de terceiros), pode instalar:

```bash
npm install axios
```

E usar normalmente:

```typescript
import axios from 'axios'

const response = await axios.get('https://api.exemplo.com/dados')
```

Mas para este projeto financeiro, **não é necessário** pois:
- ✅ Todas as operações são Server Actions
- ✅ Banco de dados acessado via Prisma
- ✅ Não há chamadas para APIs externas

## Estrutura de Comunicação

```
Componente React (Client)
    ↓
Server Action (lib/actions/*.ts)
    ↓
Prisma Client (lib/prisma.ts)
    ↓
PostgreSQL (hardcoded no schema.prisma)
```

## Verificação

Para confirmar que tudo está funcionando:

1. **Banco de dados conectado:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

2. **Servidor funcionando:**
   ```bash
   npm run dev
   ```

3. **Testar conexão:**
   - Acesse http://localhost:3000
   - Tente criar uma categoria ou transação
   - Se funcionar, a conexão está ok!

## Notas Importantes

- ⚠️ A URL do banco está **hardcoded** no schema.prisma
- ✅ Não há dependência de variáveis de ambiente para o banco
- ✅ Não há uso de axios no projeto atual
- ✅ Todas as operações são Server Actions (mais seguro e eficiente)

