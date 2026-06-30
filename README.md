# BarberFlow

SaaS minimalista para gerenciamento de barbearias, preparado para deploy em producao no Railway.

## Stack

- Next.js 15 com App Router
- TypeScript
- Tailwind CSS
- Componentes no estilo shadcn/ui
- Prisma
- PostgreSQL
- Login simples do owner com cookie `httpOnly`

## Funcionalidades

- Landing page publica.
- Login do owner por email e senha configurados em variaveis de ambiente.
- Criacao automatica da barbearia no primeiro login.
- Dashboard protegido por cookie de sessao.
- Cadastro, edicao e exclusao de barbeiros.
- Cadastro, edicao e exclusao de servicos.
- Agendamentos manuais e pelo link publico.
- Multiplos servicos no mesmo agendamento.
- Horarios ocupados somem somente para o barbeiro selecionado.

## Variaveis de ambiente

Copie `.env.example` para `.env` no desenvolvimento local.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
BARBERFLOW_OWNER_EMAIL="owner@barberflow.com"
BARBERFLOW_OWNER_PASSWORD="troque-esta-senha"
BARBERFLOW_SESSION_COOKIE="barberflow_session"
BARBERFLOW_SESSION_SECRET="gere-um-token-longo-e-aleatorio"
NEXT_PUBLIC_APP_URL="https://seu-dominio.up.railway.app"
```

Em producao, troque `BARBERFLOW_OWNER_PASSWORD` e `BARBERFLOW_SESSION_SECRET`.

## Como rodar localmente

Voce precisa ter um PostgreSQL local rodando e preencher `DATABASE_URL`.

```bash
npm install
npm run db:deploy
npm run dev
```

Acesse:

- Landing: `http://127.0.0.1:3000`
- Login: `http://127.0.0.1:3000/login`
- Dashboard: `http://127.0.0.1:3000/dashboard`
- Link publico: `http://127.0.0.1:3000/agendar/minha-barbearia`

## Deploy no Railway

1. Envie o projeto para um repositorio no GitHub.
2. No Railway, crie um novo projeto usando **Deploy from GitHub repo**.
3. Adicione um banco **PostgreSQL** no mesmo projeto.
4. No servico do app, configure as variaveis:

```env
DATABASE_URL="${{Postgres.DATABASE_URL}}"
BARBERFLOW_OWNER_EMAIL="seu-email@dominio.com"
BARBERFLOW_OWNER_PASSWORD="uma-senha-forte"
BARBERFLOW_SESSION_COOKIE="barberflow_session"
BARBERFLOW_SESSION_SECRET="um-token-longo-e-aleatorio"
NEXT_PUBLIC_APP_URL="https://seu-dominio.up.railway.app"
```

5. O arquivo `railway.json` ja define:

```bash
npm run start:prod
```

Esse comando aplica as migracoes com Prisma e inicia o Next.js em producao.

6. Gere o dominio publico do servico no Railway e atualize `NEXT_PUBLIC_APP_URL`.

## Comandos uteis

```bash
npm run build
npm run start
npm run db:deploy
npm run db:studio
```

## Observacao importante

Esta versao esta pronta para deploy real do MVP, mas ainda usa login simples de um unico owner. Para vender para varias barbearias independentes com usuarios reais, o proximo passo recomendado e implementar cadastro de usuarios, recuperacao de senha e assinatura/pagamento.
