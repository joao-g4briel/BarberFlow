# BarberFlow

MVP local e minimalista de um SaaS para gerenciamento de barbearias.

Stack:

- Next.js 15 com App Router
- TypeScript
- Tailwind CSS
- Componentes no estilo shadcn/ui
- Prisma
- SQLite local
- Login fake com cookie `httpOnly`

## Funcionalidades

- Landing page publica simples.
- Login fake: `owner@barberflow.com` / `123456`.
- Criacao automatica da barbearia no primeiro login.
- Dashboard do owner.
- Cadastro, edicao e exclusao de barbeiros.
- Cadastro, edicao e exclusao de servicos.
- Agendamentos manuais e pelo link publico.
- Multiplos servicos no mesmo agendamento.
- Horarios ocupados somem somente para o barbeiro selecionado.

## Variaveis

```env
DATABASE_URL="file:./dev.db"
BARBERFLOW_OWNER_EMAIL="owner@barberflow.com"
BARBERFLOW_OWNER_PASSWORD="123456"
BARBERFLOW_SESSION_COOKIE="barberflow_session"
```

## Como rodar localmente

```bash
npm install
npm run db:push
npm run dev
```

Acesse:

- Landing: `http://127.0.0.1:3000`
- Login: `http://127.0.0.1:3000/login`
- Dashboard: `http://127.0.0.1:3000/dashboard`
- Link publico: `http://127.0.0.1:3000/agendar/minha-barbearia`

## Banco

O banco usa Prisma + SQLite em `prisma/dev.db`.

Para aplicar o schema:

```bash
npm run db:push
```
