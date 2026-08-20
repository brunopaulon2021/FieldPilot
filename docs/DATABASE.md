# Database

## Provider

Supabase PostgreSQL. Migrations SQL versionadas no repositório serão a única forma de alterar schema de ambientes partilhados.

## Schema implementado na Fase 2

- `profiles`: perfil de apresentação ligado 1:1 a `auth.users`;
- `organizations`: tenant, slug, timezone e país;
- `organization_members`: ligação entre utilizador, organização e role;
- `invitations`: convites normalizados, expirados e armazenados apenas por hash;
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

Migration: `supabase/migrations/20260820131835_auth_organizations.sql`.

## Convenções

- UUID interno; identificador humano separado (`SR-2026-00182`, `WO-2026-00391`);
- `organization_id` obrigatório nas entidades tenant-owned;
- `created_at`, `updated_at` em UTC;
- `created_by`/`updated_by` onde auditoria for relevante;
- soft delete apenas quando retenção e recuperação exigirem;
- constraints e índices acompanham migrations;
- transições críticas executadas em transação.

## Domínios previstos

SaaS: `profiles`, `organizations`, `organization_members`, `invitations`.
Clientes: `customers`, `customer_contacts`, `customer_locations`.
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

`supabase/tests/auth_organizations_rls.sql` cria tenants A e B numa transação descartável e prova isolamento de `SELECT`, `INSERT`, `UPDATE` e `DELETE`, criação automática do Owner e proteção do último Owner.
