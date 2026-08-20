# Testing

## Pirâmide

- Unit: regras de domínio, state machines, permissions, entitlements, schemas, SLA e quotas;
- Integration: PostgreSQL, RLS, Auth, Storage, webhooks e adapters mocked;
- E2E: jornadas completas de Owner, Technician, Customer, QR e acesso indevido.

## Comandos

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm build
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

## Cross-tenant

Cada vertical slice persistente deve criar Organization A e B e provar que A não lê, altera, elimina, enumera nem obtém URLs de storage de B.

## Definition of Done

Fluxo feliz, erros, loading/empty states, permissões, mobile, acessibilidade, logs e documentação testados. Não perseguir percentagem de coverage sem valor; toda regra crítica precisa de teste comportamental.
