# Database

## Provider

Supabase PostgreSQL. Migrations SQL versionadas no repositório serão a única forma de alterar schema de ambientes partilhados.

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
