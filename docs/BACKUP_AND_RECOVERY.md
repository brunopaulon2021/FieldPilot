# Backup and Recovery

## Objetivos iniciais

- RPO: até 24 horas no plano inicial, a reduzir conforme plano Supabase e clientes;
- RTO: até 4 horas para incidentes graves;
- releases de aplicação recuperáveis via deployments imutáveis da Vercel.

## Dados

Ativar backups automáticos/PITR conforme o plano comercial antes de receber clientes pagantes. Guardar migrations no Git. Storage precisa de política de retenção e inventário; backup de PostgreSQL não inclui ficheiros.

## Exercício de recuperação

Trimestralmente restaurar backup num ambiente isolado, executar migrations, validar contagens, RLS, ficheiros e fluxos críticos. Registar duração e falhas.

## Incidente

1. conter escrita quando necessário;
2. preservar logs e timeline;
3. restaurar último estado consistente;
4. validar isolamento e integridade;
5. reabrir acesso progressivamente;
6. produzir post-mortem sem culpa e ações verificáveis.
