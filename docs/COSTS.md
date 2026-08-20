# Costs

## Princípio

Começar com poucos providers e custos previsíveis. Supabase cobre database, auth e storage; Vercel hospeda a aplicação. Não adicionar Redis, filas dedicadas, microserviços ou Kubernetes sem necessidade medida.

## Centros de custo

- Vercel: builds, functions, bandwidth;
- Supabase: compute, database, storage, egress e backups;
- Resend: emails transacionais;
- Stripe: taxa por pagamento;
- Meta: conversas WhatsApp, somente no add-on correspondente;
- OpenAI: tokens/áudio, repercutidos no add-on FieldPilot AI;
- error tracking: provider a decidir.

## Controlo

Metering por organização, alertas de orçamento, limites de upload, retenção, quotas de IA e revisão mensal. Custos opcionais devem estar ligados ao plano/add-on que os causa.
