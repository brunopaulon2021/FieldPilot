# Integrations

## Supabase

PostgreSQL, Auth e Storage oficiais. Realtime somente onde medição provar benefício. Buckets privados e RLS por tenant.

## Resend

Implementará `EmailProvider`. Convites, recuperação, notificações e relatórios não importarão diretamente o SDK fora do adapter.

## Meta WhatsApp Cloud API

Implementará `MessagingProvider` na Fase 16. Feature flag, webhook idempotente, opt-in e templates aprovados. Ausência de credenciais não bloqueia o produto.

## OpenAI

Implementará `AIProvider` no add-on FieldPilot AI. Entitlements, quota, metering, validação estruturada e fallback para core sem IA.

## Stripe

Checkout, Customer Portal e webhooks idempotentes. Estado de subscrição é confirmado server-side; frontend não concede entitlement.

## ERP

Camada futura para PHC, Moloni, Primavera e Sage. FieldPilot não implementa contabilidade.
