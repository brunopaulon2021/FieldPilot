# AI Handoff

Atualizado em: 2026-08-20
Versão do produto: 0.3.0-rc.1

## Produto

FieldPilot é um SaaS B2B para empresas portuguesas com técnicos no terreno. Resolve a fragmentação entre WhatsApp, chamadas, folhas de cálculo e papel. A proposta é acompanhar o trabalho desde o pedido até ao relatório, mantendo histórico por cliente, local e equipamento. Não é um ERP e deve integrar-se futuramente com PHC, Moloni, Primavera e Sage.

O blueprint integral recebido do produto está preservado em [MASTER_PROMPT.md](MASTER_PROMPT.md). Quando documentação e código divergirem, o código validado é a realidade e a documentação deve ser corrigida no mesmo commit.

## Stack atual

- Next.js 16.3.1, App Router e Node.js runtime;
- React 19.2.8 e TypeScript 6 strict;
- Tailwind CSS 4.3.3, convenções shadcn/ui e Lucide;
- pnpm 11.22 e Node.js 24;
- Vitest 4.1, Testing Library e Playwright 1.62;
- GitHub Actions;
- Supabase FieldPilot provisionado, migration aplicada e SSR integrado; Vercel de produção ligado; Resend, Meta WhatsApp e OpenAI continuam opcionais e não ligados.

## Arquitetura

Monólito modular Next.js. UI pública e futura aplicação autenticada partilham design tokens, mas os limites de domínio devem permanecer claros. Operações sensíveis serão executadas no servidor. Supabase será a fonte de verdade para Auth, PostgreSQL e Storage. Todas as tabelas de negócio terão `organization_id` e RLS. IA e WhatsApp serão adapters opcionais protegidos por entitlements e feature flags.

Detalhes em [ARCHITECTURE.md](ARCHITECTURE.md).

## Estrutura do projeto

- `src/app`: landing, Auth, onboarding, painel, metadados e route handlers;
- `src/components`: componentes reutilizáveis;
- `src/lib`: lógica pura e utilitários;
- `tests/e2e`: fluxos Playwright;
- `docs`: documentação permanente e decisões;
- `.github/workflows`: CI.

## Estado atual

Funciona agora:

- landing/shell responsiva em português de Portugal;
- navegação por âncoras sem ações falsas;
- tema system/light/dark persistido localmente;
- visualização realista do futuro painel operacional;
- metadados, manifest e health endpoint;
- base de testes e CI definidas.
- cadastro, confirmação de email, login, logout e recuperação de acesso;
- onboarding que cria organização e Owner atomicamente;
- painel protegido e fallback seguro quando as chaves ainda não estão configuradas;
- migration com perfis, organizações, memberships, convites, RLS e grants explícitos;
- carteira de clientes com pesquisa, criação, edição e arquivo reversível;
- múltiplos locais por cliente com seleção consistente do local principal;
- painel com contadores reais de clientes ativos e locais;
- permissões de cliente/local por role, RLS, foreign key composta e ausência de `DELETE` para `authenticated`;
- testes de validação, open redirect e isolamento cross-tenant.

O projeto Supabase exclusivo do FieldPilot usa o ref `pbhjphqimvoffgdtwcer`. A migration remota, a matriz cross-tenant, o lint e os advisors passaram no GitHub Actions. As variáveis públicas estão configuradas na Vercel e a Site URL/allowlist de Auth foram confirmadas pela Management API. A release candidate está em produção; falta o smoke test com email real para confirmação e recuperação.

## Implementação concluída para integração

Release candidate 0.3.0: Customers + Customer Locations completa no código e no Supabase remoto. O CI `32397284781` aprovou lint, typecheck, 14 testes unitários, build e E2E. O workflow de banco `32397447479` aprovou dry-run, migrations, histórico, duas matrizes cross-tenant, lint, advisors e verificação de RLS.

## Próxima tarefa recomendada

Integrar a PR `#12`, confirmar o deploy da Vercel e fazer o smoke test autenticado de Customers + Customer Locations em desktop e mobile.

## Backlog próximo

1. testar Customers + Customer Locations em produção;
2. Assets e QR;
3. Service Requests;
4. Work Orders;
5. Agenda operacional.

## Decisões importantes

- monólito modular Next.js para reduzir custo operacional;
- Supabase como database/auth/storage;
- IA como add-on isolado e nunca necessário ao core;
- português de Portugal e timezone `Europe/Lisbon` como baseline;
- sem preços inventados nem formulários sem backend na primeira shell.

Ver [DECISIONS.md](DECISIONS.md).

## Integrações

Configuradas: Vercel de produção, com produção pública e previews protegidos, e Supabase exclusivo do FieldPilot com publishable key.
Preparada: integração SSR do Supabase e variáveis documentadas em `.env.example`.
Aguardam credenciais: Resend, OpenAI e Meta WhatsApp; nenhuma bloqueia a Fase 2.

## Banco

Migration `20260820131835_auth_organizations.sql` aplicada no projeto FieldPilot com `profiles`, `organizations`, `organization_members`, `invitations`, triggers, índices, grants e policies. As migrations `20260820160931_customers_locations.sql` e `20260820172159_harden_customer_location_primary_scope.sql` também foram aplicadas e toda a suíte de banco passou. O smoke autenticado revelou que `INSERT ... RETURNING` de organização precisava permitir leitura pelo criador antes do trigger `AFTER INSERT`; a correção versionada está em `20260820173617_allow_organization_creator_returning.sql`.

## Segurança

Implementado: CSP limitada ao host Supabase FieldPilot, SSR com `getClaims`, validação Zod server-side, redirects locais, RLS multi-tenant, schema privado e permissions mínimas no workflow.
Próximo: rate limiting de convites e audit log.

## Deploy

Vercel ativa em `https://field-pilot-brunopaulon2021s-projects.vercel.app/`. A produção é pública, os previews protegidos e as variáveis públicas do Supabase FieldPilot estão configuradas. Consulte [DEPLOYMENT.md](DEPLOYMENT.md).

## Testes

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e`

Cobertura atual: tema, schemas de Auth e Customers, geração de slug, proteção de redirects, landing, páginas públicas de Auth, proteção das rotas `/app` e `/app/customers` e matrizes SQL cross-tenant. Typecheck, lint, 14 testes unitários, build e E2E desktop/mobile passaram no CI; as duas matrizes SQL passaram no banco remoto.

## Problemas conhecidos

- social preview ainda não tem imagem própria;
- confirmação de email e recuperação ainda precisam de um smoke test com caixa de correio real.

## Bloqueios

- smoke test de cadastro, confirmação e recuperação com uma caixa de correio real.

## Último commit/release

A release candidate `0.3.0` foi preparada na PR `#12`. O SHA `7f63a5f` passou no CI `32397284781` e no workflow remoto de banco `32397447479`; falta integrar, confirmar o deploy e concluir os smoke tests autenticados.
