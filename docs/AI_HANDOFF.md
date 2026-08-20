# AI Handoff

Atualizado em: 2026-08-20
Versão do produto: 0.1.0

## Produto

FieldPilot é um SaaS B2B para empresas portuguesas com técnicos no terreno. Resolve a fragmentação entre WhatsApp, chamadas, folhas de cálculo e papel. A proposta é acompanhar o trabalho desde o pedido até ao relatório, mantendo histórico por cliente, local e equipamento. Não é um ERP e deve integrar-se futuramente com PHC, Moloni, Primavera e Sage.

O blueprint integral recebido do produto está preservado em [MASTER_PROMPT.md](MASTER_PROMPT.md). Quando documentação e código divergirem, o código validado é a realidade e a documentação deve ser corrigida no mesmo commit.

## Stack atual

- Next.js 16.3.1, App Router e Node.js runtime;
- React 19.2.8 e TypeScript 7 strict;
- Tailwind CSS 4.3.3, convenções shadcn/ui e Lucide;
- pnpm 11.22 e Node.js 24;
- Vitest 4.1, Testing Library e Playwright 1.62;
- GitHub Actions;
- Supabase, Vercel, Resend, Meta WhatsApp e OpenAI são providers decididos, ainda não ligados.

## Arquitetura

Monólito modular Next.js. UI pública e futura aplicação autenticada partilham design tokens, mas os limites de domínio devem permanecer claros. Operações sensíveis serão executadas no servidor. Supabase será a fonte de verdade para Auth, PostgreSQL e Storage. Todas as tabelas de negócio terão `organization_id` e RLS. IA e WhatsApp serão adapters opcionais protegidos por entitlements e feature flags.

Detalhes em [ARCHITECTURE.md](ARCHITECTURE.md).

## Estrutura do projeto

- `src/app`: rotas, layout, metadados e route handlers;
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

Ainda não existe autenticação, base Supabase nem dados persistidos; esses itens pertencem à próxima vertical slice e não são apresentados como funcionais.

## Última implementação concluída

Release 0.1.0: fundação técnica, visual, testes, CI, documentação e shell comercial.

## Próxima tarefa recomendada

Implementar **Auth + Organizations** como slice completa: projeto Supabase, migrations, RLS, signup/login/logout/recovery, criação de organização, membership Owner, onboarding mínimo, testes cross-tenant e deploy.

## Backlog próximo

1. Auth + Organizations;
2. Customers;
3. Customer Locations;
4. Assets e QR;
5. Service Requests.

## Decisões importantes

- monólito modular Next.js para reduzir custo operacional;
- Supabase como database/auth/storage;
- IA como add-on isolado e nunca necessário ao core;
- português de Portugal e timezone `Europe/Lisbon` como baseline;
- sem preços inventados nem formulários sem backend na primeira shell.

Ver [DECISIONS.md](DECISIONS.md).

## Integrações

Configuradas: nenhuma integração externa com credenciais.
Preparadas: variáveis documentadas em `.env.example`.
Aguardam credenciais: Supabase, Vercel, Resend, OpenAI e Meta WhatsApp. OpenAI e WhatsApp não bloqueiam o core.

## Banco

Nenhuma migration criada porque a slice de Auth + Organizations ainda não começou. O modelo e as regras estão descritos em [DATABASE.md](DATABASE.md). A primeira migration deve criar `profiles`, `organizations`, `organization_members` e `invitations` com RLS e testes de isolamento.

## Segurança

Implementado: headers básicos, variáveis server-only separadas, nenhuma secret no código e permissions mínimas no workflow.
Próximo: Content Security Policy baseada nos hosts efetivos, RLS, validação Zod server-side, rate limiting e audit log.

## Deploy

Destino definido: Vercel para a aplicação e Supabase para dados. Ainda não existe projeto Vercel ligado nem URL de produção. Consulte [DEPLOYMENT.md](DEPLOYMENT.md).

## Testes

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e`

Cobertura atual: lógica de tema; E2E da proposta de valor, navegação e health check. O ambiente desta implementação não conseguiu aceder ao registry npm, portanto a validação executável deve ser confirmada pelo CI após o primeiro push.

## Problemas conhecidos

- lockfile ainda não foi gerado porque o registry npm não estava acessível no ambiente de criação;
- social preview ainda não tem imagem própria;
- CSP será adicionada quando hosts de Supabase/Vercel estiverem definidos.

## Bloqueios

- credenciais/projeto Supabase para a Fase 2;
- ligação à Vercel para deploy de produção.

## Último commit/release

Release preparada: `0.1.0`. Atualizar esta secção com SHA, resultado do CI e URL depois da publicação.
