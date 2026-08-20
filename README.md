# FieldPilot

FieldPilot é um SaaS B2B para empresas de assistência técnica com equipas no terreno. Centraliza pedidos, agenda, clientes, locais, equipamentos, ordens de trabalho, evidências e relatórios, sem tentar substituir o ERP.

## Estado

O projeto está na **Fase 2 — Autenticação e Organizações**. A fundação pública está em produção e a aplicação já inclui cadastro, confirmação de email, login, recuperação de acesso, onboarding da empresa e área protegida com isolamento multi-tenant.

## Stack

- Next.js 16.3 com App Router e React 19.2;
- TypeScript strict, Tailwind CSS 4 e componentes no padrão shadcn/ui;
- Supabase PostgreSQL e Auth com SSR, migrations e RLS;
- Vitest, Testing Library e Playwright;
- Vercel, Supabase e GitHub Actions.

## Desenvolvimento

Requisitos: Node.js 24+ e pnpm 11.22+.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Abra `http://localhost:3000`. O health check fica em `http://localhost:3000/api/health`.

Para ativar autenticação, preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com valores de um projeto Supabase exclusivo do FieldPilot. Nunca use a service-role key no browser.

## Qualidade

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## Documentação

- [Continuidade entre IAs](docs/AI_HANDOFF.md)
- [Blueprint completo do produto](docs/MASTER_PROMPT.md)
- [Requisitos do produto](docs/PRD.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Base de dados](docs/DATABASE.md)
- [Segurança](docs/SECURITY.md)
- [Deploy](docs/DEPLOYMENT.md)
- [Testes](docs/TESTING.md)
- [Integrações](docs/INTEGRATIONS.md)
- [Backup e recuperação](docs/BACKUP_AND_RECOVERY.md)
- [Custos](docs/COSTS.md)
- [Decisões](docs/DECISIONS.md)
- [Limitações conhecidas](docs/KNOWN_LIMITATIONS.md)

## Regra de entrega

Cada funcionalidade é construída como vertical slice completa em branch curta. Código, testes e documentação entram juntos. A `main` representa produção e deve permanecer compilável e utilizável.
