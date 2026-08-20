# Database

## Provider

Supabase PostgreSQL. Migrations SQL versionadas no repositório serão a única forma de alterar schema de ambientes partilhados.

## Schema implementado

- `profiles`: perfil de apresentação ligado 1:1 a `auth.users`;
- `organizations`: tenant, slug, timezone e país;
- `organization_members`: ligação entre utilizador, organização e role;
- `invitations`: convites normalizados, expirados e armazenados apenas por hash;
- `customers`: empresas e particulares de cada tenant, com arquivo reversível;
- `customer_locations`: moradas operacionais ligadas ao cliente e ao mesmo tenant;
- `private`: funções auxiliares de autorização e triggers, fora da Data API.

A criação de `organizations` exige `created_by = auth.uid()`. Um trigger `security definer` cria imediatamente o membership `owner`, na mesma transação. Outro trigger impede eliminar ou despromover o último Owner.

## Roles

`owner`, `admin`, `dispatcher`, `technician` e `customer`. Roles ficam em `organization_members`; metadata editável do Auth nunca participa da autorização.

## Acesso

- `anon` não recebe privilégios sobre as tabelas;
- `authenticated` recebe apenas os privilégios SQL necessários;
- RLS filtra cada operação por membership e role;
- helpers de policy ficam no schema não exposto `private`;
- índices cobrem FKs, pesquisas de membership e convites pendentes;
- novas tabelas são expostas por `GRANT` explícito, compatível com o default do Supabase de abril de 2026.

Migrations:

- `supabase/migrations/20260820131835_auth_organizations.sql`;
- `supabase/migrations/20260820160931_customers_locations.sql`.

Clientes e locais usam uma foreign key composta por `customer_id` e `organization_id`, impedindo associações cross-tenant também ao nível relacional. Apenas Owner, Admin e Dispatcher podem escrever; Technician pode ler e Customer não recebe acesso geral. Não existe `DELETE` para o role `authenticated`: clientes são arquivados. Um índice parcial garante no máximo um local principal e um trigger mantém o primeiro local como principal.

## Convenções

- UUID interno; identificador humano separado (`SR-2026-00182`, `WO-2026-00391`);
- `organization_id` obrigatório nas entidades tenant-owned;
- `created_at`, `updated_at` em UTC;
- `created_by`/`updated_by` onde auditoria for relevante;
- soft delete apenas quando retenção e recuperação exigirem;
- constraints e índices acompanham migrations;
- transições críticas executadas em transação.

## Domínios previstos

SaaS implementado: `profiles`, `organizations`, `organization_members`, `invitations`.
Clientes implementado: `customers`, `customer_locations`.
Clientes previsto: `customer_contacts`.
Equipamentos: `assets`, `asset_categories`, `asset_documents`, `asset_qr_tokens`.
Operação: `service_requests`, `work_orders`, `work_order_assignments`, `work_order_events`, `work_logs`.
Outros: materiais, media, assinaturas, preventiva, orçamentos, comunicação, relatórios, audit, subscriptions, entitlements e usage.

## Regras

- RLS habilitada em todas as tabelas acessíveis pela API;
- policies baseadas no `auth.uid()` e memberships server-controlled;
- nunca confiar em metadata editável pelo utilizador;
- testes cross-tenant para cada nova entidade;
- views respeitam invoker security;
- `service_role` é exclusivamente server-side e não substitui autorização.

## Validação

- `supabase/tests/auth_organizations_rls.sql` prova isolamento de Auth/Organizations, criação automática do Owner e proteção do último Owner;
- `supabase/tests/customers_locations_rls.sql` prova isolamento de clientes e locais, permissões do Technician, ausência de `DELETE`, foreign key tenant-safe e troca atómica do local principal.

Ambas as suítes criam tenants descartáveis e terminam com `ROLLBACK`.
