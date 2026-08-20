# Architecture Decision Records

## ADR-001 — Monólito modular Next.js

**Decisão:** usar uma aplicação Next.js com módulos de domínio.
**Motivo:** menor custo, deploy simples, consistência transacional e debugging direto.
**Consequência:** fronteiras precisam ser mantidas por estrutura e testes; extração para serviços depende de evidência.

## ADR-002 — Supabase como backend inicial

**Decisão:** PostgreSQL, Auth e Storage no Supabase.
**Motivo:** reduz fornecedores, custo e integração operacional.
**Consequência:** policies RLS e migrations tornam-se componentes críticos.

## ADR-003 — Supabase Storage, não Cloudinary

**Decisão:** fotografias, PDFs, documentos, assinaturas e áudio em buckets privados do Supabase.
**Motivo:** menos um fornecedor e autorização integrada ao tenant.
**Consequência:** transformação pesada de media não faz parte do primeiro escopo.

## ADR-004 — FieldPilot AI como add-on

**Decisão:** core funciona sem IA; features de IA usam provider abstraction, entitlements, quotas e metering.
**Motivo:** custo controlável e produto resiliente a indisponibilidade do provider.
**Consequência:** nenhum workflow core pode depender de resposta de IA.

## ADR-005 — PostgreSQL partilhado com RLS

**Decisão:** shared schema, `organization_id` e policies deny-by-default.
**Motivo:** simplicidade operacional com isolamento forte e testável.
**Consequência:** testes cross-tenant são gate obrigatório de cada slice.

## ADR-006 — Design system semântico e glass discreto

**Decisão:** tokens semânticos, light principal, dark/system e glass apenas em superfícies flutuantes.
**Motivo:** consistência, acessibilidade e visual premium sem sacrificar legibilidade/performance.
**Consequência:** componentes não devem introduzir cores arbitrárias fora dos tokens.
