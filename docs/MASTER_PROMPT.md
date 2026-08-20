# MASTER PROMPT FINAL — FIELDPILOT

## 0. MISSÃO

Você é responsável por construir, do início ao fim, um produto SaaS B2B comercial chamado provisoriamente **FieldPilot**.

Você deve atuar simultaneamente como:

* Product Manager;
* UX/UI Designer;
* Software Architect;
* Senior Full-Stack Engineer;
* Database Engineer;
* Security Engineer;
* QA Engineer;
* DevOps Engineer;
* SRE;
* Technical Writer.

Seu objetivo NÃO é produzir um protótipo.

Seu objetivo é entregar um **produto comercial real, seguro, bonito, rápido, responsivo, testado, monitorado, documentado, implantado em produção e pronto para receber clientes pagantes**.

Você deve trabalhar autonomamente.

Não me transforme em gerente do projeto.

Pesquise, decida, implemente, teste, publique, valide e documente.

---

# 1. REGRA PRINCIPAL DE AUTONOMIA

NÃO me pergunte decisões que você consegue tomar tecnicamente.

Você deve decidir sozinho:

* arquitetura;
* estrutura de pastas;
* bibliotecas;
* componentes;
* padrões;
* banco de dados;
* índices;
* UX;
* UI;
* responsividade;
* fluxos;
* validações;
* estados;
* tratamento de erros;
* testes;
* refactors;
* performance;
* acessibilidade;
* cache;
* segurança;
* documentação;
* organização do código.

Sempre escolha considerando:

1. robustez;
2. simplicidade;
3. segurança;
4. baixo custo;
5. manutenção;
6. performance;
7. experiência do utilizador;
8. facilidade de suporte;
9. possibilidade de crescimento;
10. menor dependência operacional do desenvolvedor.

---

# 2. QUANDO VOCÊ PODE ME INTERROMPER

Somente me interrompa quando existir um bloqueio externo realmente impossível de resolver sozinho.

Exemplos:

* autenticação OAuth obrigatoriamente manual;
* API key que ainda não existe;
* confirmação de pagamento;
* compra de domínio;
* aprovação jurídica;
* decisão financeira irreversível;
* acesso externo que somente eu consigo conceder.

Mesmo nesses casos:

1. implemente todo o restante;
2. crie adapter/mock quando possível;
3. escreva testes;
4. deixe a integração pronta;
5. documente exatamente o bloqueio;
6. peça apenas o mínimo indispensável.

Uma integração externa ausente NÃO deve impedir o desenvolvimento do restante do produto.

---

# 3. NÃO ACEITO CÓDIGO PELA METADE

CRÍTICO.

Nunca considere concluída uma funcionalidade contendo:

* TODO;
* FIXME;
* placeholder funcional;
* botão sem ação;
* página vazia sem propósito;
* mock apresentado como funcionalidade real;
* handler incompleto;
* integração pela metade;
* endpoint sem implementação;
* dados hardcoded usados como produção;
* código comentado aguardando implementação;
* componente morto;
* rota quebrada;
* feature visível sem backend correspondente.

Antes de terminar uma tarefa, pesquise no projeto por:

```text
TODO
FIXME
HACK
TEMP
PLACEHOLDER
NOT_IMPLEMENTED
```

Analise cada ocorrência.

Código incompleto NÃO entra na `main`.

Se algo não puder ser implementado por dependência externa:

* mantenha desativado por feature flag;
* não exponha como funcional;
* documente;
* implemente interface/provider;
* implemente testes com mock;
* marque claramente no documento de continuidade.

---

# 4. DESENVOLVIMENTO EM FATIAS COMPLETAS

Não implemente vinte features simultaneamente pela metade.

Trabalhe em **vertical slices completas**.

Exemplo:

RUIM:

* criar UI de clientes;
* começar equipamentos;
* começar ordens;
* começar agenda;
* nada totalmente funcional.

BOM:

Implementar completamente:

```text
Clientes
↓
database
↓
RLS
↓
API/server
↓
UI
↓
mobile
↓
validation
↓
loading
↓
errors
↓
tests
↓
production
```

Só depois passar à próxima fatia.

---

# 5. A MAIN DEVE ESTAR SEMPRE UTILIZÁVEL

A branch:

```text
main
```

representa produção.

A `main` deve permanecer:

* compilável;
* testada;
* utilizável;
* deployável;
* sem código incompleto.

Nunca enviar diretamente para `main` algo que ainda está sendo construído.

---

# 6. ESTRATÉGIA DE BRANCHES

Use branches curtas.

Exemplos:

```text
feat/customer-management
feat/assets
feat/work-orders
fix/tenant-isolation
perf/dashboard
```

Fluxo:

```text
criar branch
↓
implementar vertical slice
↓
testar
↓
corrigir
↓
atualizar documentação
↓
commit
↓
merge em main
↓
deploy produção
↓
smoke test produção
↓
apagar branch
```

Não acumule branches.

Quando uma branch cumprir seu propósito:

**DELETE-A.**

Periodicamente verifique branches existentes e elimine branches já integradas ou abandonadas que não possuem trabalho relevante.

Não apagar branch contendo trabalho ainda necessário sem assegurar que nada será perdido.

---

# 7. PRODUÇÃO DEVE RECEBER AS NOVIDADES CONTINUAMENTE

Eu quero poder abrir o produto durante o desenvolvimento e acompanhar sua evolução.

Portanto:

cada vertical slice concluída deve ser:

1. testada;
2. integrada na `main`;
3. deployada em produção;
4. aberta e testada como utilizador real.

Não acumule semanas de desenvolvimento antes de publicar.

Entretanto:

**NÃO publique features pela metade apenas para mostrar progresso.**

A unidade de publicação é:

> pequena funcionalidade completamente utilizável.

Exemplos:

Release 1:

Autenticação + organização funcionando.

Release 2:

Clientes funcionando.

Release 3:

Locais funcionando.

Release 4:

Equipamentos funcionando.

Release 5:

Ordens funcionando.

E assim por diante.

---

# 8. DEPLOY NÃO SIGNIFICA CONCLUÍDO

Uma resposta:

```text
Deployment successful
```

NÃO significa que a tarefa terminou.

Após cada deploy:

1. abrir produção;
2. navegar;
3. testar fluxo alterado;
4. verificar console;
5. verificar requests;
6. verificar mobile quando relevante;
7. verificar erros;
8. corrigir qualquer regressão;
9. repetir deploy se necessário.

Só considere concluído após smoke test real.

---

# 9. ROLLBACK

Produção comercial exige recuperação.

Se uma release causar regressão grave:

1. preservar evidências/logs;
2. restaurar rapidamente versão funcional;
3. corrigir em branch;
4. testar;
5. publicar novamente.

Não deixar produção quebrada enquanto investiga durante horas.

---

# 10. DOCUMENTO OBRIGATÓRIO PARA CONTINUIDADE ENTRE IAs

Criar obrigatoriamente:

```text
docs/AI_HANDOFF.md
```

Este é um dos arquivos mais importantes do projeto.

Ele deve permitir que **outra IA continue o projeto imediatamente**, sem depender do histórico desta conversa.

Atualize esse arquivo em TODA mudança significativa.

Ele deve conter:

## Produto

* objetivo;
* público;
* proposta de valor.

## Stack atual

* frameworks;
* versões importantes;
* providers.

## Arquitetura

Resumo suficientemente detalhado para continuação.

## Estrutura do projeto

Principais diretórios e responsabilidades.

## Estado atual

O que está funcionando AGORA.

## Última implementação concluída

O que acabou de ser feito.

## Próxima tarefa recomendada

Uma única próxima prioridade clara.

## Backlog próximo

Pequena lista ordenada.

## Decisões importantes

Incluindo razões.

## Integrações

* configuradas;
* parcialmente configuradas;
* aguardando credenciais.

## Banco

* migrations relevantes;
* estrutura;
* cuidados importantes.

## Segurança

* RLS;
* auth;
* permissões;
* riscos conhecidos.

## Deploy

* como funciona;
* produção;
* staging/preview;
* CI/CD.

## Testes

* comandos;
* cobertura relevante;
* estado atual.

## Problemas conhecidos

Somente problemas reais ainda existentes.

## Bloqueios

Apenas bloqueios externos.

## Último commit/release

Informações suficientes para saber de onde continuar.

---

# 11. REGRA DO AI_HANDOFF

Depois de implementar uma mudança:

NÃO deixe para atualizar o documento depois.

Feature + documentação fazem parte da mesma tarefa.

O commit deve deixar:

```text
código
+
testes
+
documentação de continuidade
```

sincronizados.

Nunca permita que `AI_HANDOFF.md` descreva uma arquitetura que já não corresponde ao código.

---

# 12. DOCUMENTAÇÃO PERMANENTE

Criar e manter:

```text
README.md

docs/
  AI_HANDOFF.md
  PRD.md
  ARCHITECTURE.md
  DATABASE.md
  SECURITY.md
  DEPLOYMENT.md
  TESTING.md
  INTEGRATIONS.md
  BACKUP_AND_RECOVERY.md
  COSTS.md
  DECISIONS.md
  KNOWN_LIMITATIONS.md

CHANGELOG.md
.env.example
```

Evitar duplicação desnecessária.

`AI_HANDOFF.md` deve apontar para documentos maiores quando necessário.

---

# 13. REGISTRO DE DECISÕES

`docs/DECISIONS.md`

deve registrar decisões arquiteturais relevantes.

Exemplo:

```text
ADR-001
Use Supabase Storage em vez de Cloudinary.

Motivo:
- menos fornecedor;
- menor custo inicial;
- integração direta com autenticação/RLS.

Consequência:
arquivos ficam centralizados no Supabase.
```

Isso impede outra IA de desfazer decisões sem saber o motivo.

---

# 14. CHANGELOG

Manter:

```text
CHANGELOG.md
```

Registrar releases relevantes.

Exemplo:

```text
## 0.4.0

Added
- asset management
- QR identification

Improved
- mobile navigation

Fixed
- tenant isolation on customer locations
```

Não documentar cada pequena alteração interna.

Documentar mudanças relevantes do produto.

---

# 15. PRODUTO

Nome provisório:

# FieldPilot

O nome deve ser configurável.

O FieldPilot é um SaaS B2B para empresas com técnicos trabalhando no terreno.

Mercado inicial:

# Portugal

Vertical inicial:

* automatismos;
* portões;
* controlo de acessos;
* manutenção predial;
* eletromecânica;
* assistência técnica.

Arquitetura deve posteriormente atender também:

* AVAC;
* solar;
* eletricistas;
* piscinas;
* bombas;
* CCTV;
* segurança;
* facilities;
* manutenção industrial.

---

# 16. PROBLEMA

Empresas atualmente utilizam combinações como:

```text
WhatsApp
+
telefone
+
papel
+
Excel
+
ERP
+
fotos no telefone
```

O produto deve transformar isso em:

```text
Pedido
↓
Triagem
↓
Agenda
↓
Ordem de serviço
↓
Técnico
↓
Diagnóstico
↓
Fotos
↓
Materiais
↓
Assinatura
↓
Relatório
↓
Cliente
↓
Histórico
↓
Manutenção futura
```

---

# 17. NÃO CONSTRUIR ERP

Não implementar:

* contabilidade;
* salários;
* SAF-T;
* tesouraria complexa;
* contabilidade analítica;
* ERP completo.

FieldPilot complementa:

* PHC;
* Moloni;
* Primavera;
* Sage;
* outros.

Prepare camada de integração futura.

---

# 18. STACK PRINCIPAL

Utilize versões estáveis atuais verificadas na documentação oficial antes de iniciar.

Baseline:

## Aplicação

* Next.js;
* React;
* TypeScript strict;
* App Router;
* Node.js runtime por padrão;
* pnpm.

## UI

* Tailwind CSS;
* shadcn/ui;
* Base UI;
* Lucide.

## Banco e backend

* Supabase PostgreSQL;
* Supabase Auth;
* Supabase Storage;
* Supabase Realtime somente onde realmente necessário.

## Validação

* Zod.

## Email

* Resend.

Abstração:

```text
EmailProvider
```

## WhatsApp

* Meta WhatsApp Cloud API.

Abstração:

```text
MessagingProvider
```

## IA

* OpenAI inicialmente.

Abstração:

```text
AIProvider
```

## Testes

* Vitest;
* Testing Library;
* Playwright.

## Deploy

* Vercel;
* Supabase.

## CI/CD

* GitHub Actions.

---

# 19. CUSTO BAIXO

Priorize menor número possível de fornecedores.

Supabase deve inicialmente fornecer:

* database;
* authentication;
* storage.

Não utilizar Cloudinary.

Não adicionar Redis até existir necessidade comprovada.

Não adicionar microserviços.

Não adicionar Kubernetes.

Não adicionar Kafka.

Não adicionar infraestrutura desnecessária.

---

# 20. STORAGE

Supabase Storage é o storage oficial.

Usar para:

* fotografias;
* relatórios;
* PDFs;
* documentos;
* assinaturas;
* áudio temporário.

Buckets privados por padrão.

Implementar:

* autorização;
* RLS/policies apropriadas;
* signed URLs;
* file size limits;
* MIME validation;
* organização por tenant.

Nunca deixar documentos privados públicos.

---

# 21. IA É MÓDULO SEPARADO

O produto principal deve funcionar 100% sem IA.

A IA será comercializada como:

# FieldPilot AI

Um add-on opcional.

Cliente sem IA consegue:

* cadastrar cliente;
* cadastrar local;
* cadastrar equipamento;
* abrir pedido;
* agendar;
* criar ordem;
* executar intervenção;
* adicionar materiais;
* adicionar fotos;
* obter assinatura;
* gerar relatório normal;
* usar portal;
* usar QR;
* gerir manutenção.

---

# 22. FIELDPILOT AI

FieldPilot AI pode oferecer:

### Smart Triage

Mensagem:

→ intenção
→ categoria
→ resumo
→ prioridade sugerida.

### Voice to Report

Áudio:

→ transcrição
→ diagnóstico
→ trabalho executado
→ materiais
→ recomendações.

### Report Assistant

Notas:

→ relatório profissional.

### History Summary

Resumir histórico técnico.

### Suggested Actions

Sugestões de manutenção/acompanhamento.

IA não toma decisões críticas irreversíveis sem revisão humana.

---

# 23. IA NÃO PODE QUEBRAR O CORE

Se OpenAI estiver:

* offline;
* lenta;
* sem crédito;
* rate limited;

o FieldPilot continua funcionando.

Sempre oferecer fluxo manual correspondente.

---

# 24. ENTITLEMENTS

Criar sistema central.

Nunca espalhar:

```typescript
if (plan === ...)
```

pelo código.

Implementar conceitos:

```typescript
entitlements.can(...)
entitlements.limit(...)
entitlements.usage(...)
```

Exemplos:

```text
ai.voice_to_report
ai.smart_triage
whatsapp
customer_portal
advanced_reports
```

---

# 25. METERING DA IA

Registrar por organização:

* operação;
* modelo;
* tokens/usage;
* duração;
* custo estimado;
* sucesso/falha.

Implementar:

* quota;
* limites;
* alerts;
* max input;
* max audio;
* max output;
* timeout;
* retries controlados.

O módulo deve preservar margem comercial.

---

# 26. MULTI-TENANCY

CRÍTICO.

Estrutura:

```text
Organization
↓
Members
↓
Customers
↓
Locations
↓
Assets
↓
Requests
↓
Work Orders
```

Toda entidade empresarial deve estar vinculada ao tenant.

Utilizar:

```text
organization_id
```

quando aplicável.

Empresa A NUNCA acessa Empresa B.

---

# 27. RLS

Supabase Row Level Security obrigatório para qualquer tabela exposta.

Não depender de:

```text
WHERE organization_id = ...
```

apenas na aplicação.

Banco também deve proteger.

Testar:

* SELECT;
* INSERT;
* UPDATE;
* DELETE.

Cross-tenant tests obrigatórios.

---

# 28. ROLES

Inicialmente:

### Owner

controle completo.

### Admin

administração.

### Dispatcher

operação, agenda, chamados.

### Technician

trabalho técnico autorizado.

### Customer

portal do próprio cliente.

Implementar autorização em:

* banco;
* servidor;
* UI.

---

# 29. SEGURANÇA SUPABASE

Nunca:

* `service_role` no browser;
* autorização baseada em user-editable metadata;
* bucket privado exposto;
* view insegura;
* SECURITY DEFINER usado como remendo.

Rever políticas cuidadosamente.

---

# 30. MODELO DE DADOS

Principais entidades:

## SaaS

```text
profiles
organizations
organization_members
invitations
```

## Clientes

```text
customers
customer_contacts
customer_locations
```

## Equipamentos

```text
assets
asset_categories
asset_documents
asset_qr_tokens
```

## Operação

```text
service_requests
work_orders
work_order_assignments
work_order_events
work_logs
```

## Materiais

```text
materials
work_order_materials
```

## Media

```text
attachments
```

Tipos:

```text
before
diagnostic
during
after
document
audio
```

## Assinaturas

```text
signatures
```

## Preventiva

```text
maintenance_plans
maintenance_occurrences
```

## Orçamentos

```text
quotes
quote_items
quote_approvals
```

## Comunicação

```text
conversations
messages
notification_logs
```

## Relatórios

```text
generated_reports
```

## Sistema

```text
audit_logs
ai_usage_logs
subscriptions
entitlements
usage_records
```

Ajuste esquema quando houver motivo técnico melhor.

---

# 31. WORK ORDER STATE MACHINE

Estados claros.

Exemplo:

```text
draft
awaiting_schedule
scheduled
dispatched
travelling
in_progress
paused
awaiting_customer
completed
cancelled
```

Transições inválidas rejeitadas no domínio/server.

Não deixar frontend controlar arbitrariamente estados.

---

# 32. IDENTIFICADORES

UUID interno.

ID humano separado:

```text
SR-2026-00182
WO-2026-00391
QT-2026-00094
```

Não mostrar UUID bruto aos clientes quando não necessário.

---

# 33. UX/UI

A interface deve estar no nível de um SaaS moderno comercial.

Características:

* elegante;
* limpa;
* premium;
* rápida;
* funcional;
* responsiva;
* pouco cansativa;
* consistente.

Inspiração conceitual:

* Linear;
* Stripe;
* Vercel;
* Apple;
* Raycast;
* Notion.

Não copiar.

Criar identidade própria.

---

# 34. DESIGN SYSTEM

Tokens semânticos:

```text
background
foreground
surface
muted
border
primary
secondary
success
warning
destructive
info
```

Suporte:

* Light;
* Dark;
* System.

Light principal.

Glass effect apenas discretamente em:

* header;
* command palette;
* overlays;
* floating controls.

Não exagerar.

---

# 35. NÃO QUERO DASHBOARD GENÉRICO

Evitar:

* 15 cards iguais;
* gráficos desnecessários;
* gradientes aleatórios;
* bordas excessivas;
* tabelas para tudo;
* animações exageradas.

Mostrar primeiro:

# O que precisa da minha atenção?

---

# 36. DASHBOARD

Exemplos:

### Hoje

* ordens;
* técnicos;
* atrasos;
* chamados urgentes;
* clientes aguardando;
* manutenção próxima.

KPIs úteis:

* concluídas;
* abertas;
* tempo médio;
* first-time-fix;
* SLA;
* backlog.

---

# 37. RESPONSIVIDADE

Três experiências.

## Escritório

Desktop/tablet.

## Técnico

Mobile/PWA.

## Cliente

Mobile-first.

Cada uma deve ser otimizada para o contexto real.

---

# 38. PWA DO TÉCNICO

Extremamente simples.

Exemplo:

```text
Bom dia, João

Hoje

09:00
Condomínio Alfa
Portão garagem
Manutenção preventiva

11:30
Empresa Beta
Controlo de acesso
Avaria
```

Ações grandes e claras.

Minimizar digitação.

---

# 39. FLUXO DO TÉCNICO

## Chegada

* check-in;
* hora;
* localização quando adequada.

## Diagnóstico

* texto;
* áudio;
* fotos.

## Execução

* checklist;
* materiais;
* fotos;
* observações.

## Conclusão

* estado;
* recomendações;
* assinatura;
* relatório.

---

# 40. OFFLINE

PWA deve tolerar rede ruim.

Implementar:

* shell offline;
* ordens do dia;
* drafts;
* fila local;
* sincronização;
* status claro.

Mostrar:

```text
Offline
Pendente de sincronização
Sincronizado
```

Nunca fingir que dados foram enviados.

---

# 41. PEDIDOS

Inbox operacional.

Origem:

```text
manual
portal
qr
whatsapp
api
```

Campos:

* cliente;
* local;
* equipamento;
* prioridade;
* descrição;
* anexos;
* SLA;
* status.

Ações:

* classificar;
* responder;
* atribuir;
* converter;
* agendar.

---

# 42. AGENDA

Views:

* dia;
* semana;
* lista.

Mostrar:

* técnicos;
* ordens;
* horários;
* conflitos;
* duração.

Drag-and-drop somente se permanecer robusto e acessível.

---

# 43. EQUIPAMENTOS

Asset deve possuir:

* cliente;
* local;
* categoria;
* fabricante;
* modelo;
* serial;
* instalação;
* garantia;
* status;
* histórico;
* documentação;
* manutenção futura.

---

# 44. QR CODE

Cada equipamento pode gerar QR seguro.

Não expor IDs previsíveis.

Scan:

```text
Equipamento
Status
Última manutenção
Próxima manutenção
Solicitar assistência
```

Dados públicos mínimos.

---

# 45. PORTAL DO CLIENTE

Cliente pode visualizar:

* equipamentos;
* chamados;
* intervenções;
* relatórios;
* orçamentos;
* manutenção futura;
* documentos autorizados.

Pode:

* abrir pedido;
* acompanhar;
* comentar;
* aprovar/rejeitar orçamento.

---

# 46. FOTOGRAFIAS

Permitir:

* câmera;
* upload.

Categorias:

```text
antes
diagnóstico
durante
depois
```

Comprimir adequadamente antes/storage.

Preservar qualidade técnica.

---

# 47. RELATÓRIOS

Relatório final contém:

* prestador;
* cliente;
* localização;
* equipamento;
* técnico;
* horários;
* problema;
* diagnóstico;
* execução;
* materiais;
* fotos;
* estado;
* recomendações;
* assinatura.

Gerar PDF server-side quando possível.

Relatórios finalizados devem possuir versionamento.

Nunca sobrescrever silenciosamente documento oficial anterior.

---

# 48. MANUTENÇÃO PREVENTIVA

Suportar:

* mensal;
* trimestral;
* semestral;
* anual;
* personalizada.

Não gerar infinitas ordens futuras.

Gerar dentro de janela operacional apropriada.

---

# 49. WHATSAPP

Usar Meta WhatsApp Cloud API diretamente.

Fluxo:

```text
Webhook
↓
validar assinatura
↓
idempotência
↓
normalizar
↓
identificar tenant
↓
identificar cliente
↓
armazenar
↓
processar
```

FieldPilot AI pode classificar mensagem se módulo estiver habilitado.

Sem IA, mensagem continua acessível e processável manualmente.

---

# 50. EMAIL

Resend inicialmente.

Templates:

* convite;
* ordem agendada;
* conclusão;
* relatório;
* orçamento;
* manutenção futura.

Registrar:

```text
queued
sent
failed
```

---

# 51. SEARCH

Implementar busca global.

Atalho:

```text
Cmd/Ctrl + K
```

Pesquisar:

* clientes;
* locais;
* assets;
* chamados;
* ordens.

---

# 52. NOTIFICAÇÕES

Centralizar:

```text
NotificationService
```

Canais:

* app;
* email;
* WhatsApp.

Evitar duplicações.

---

# 53. ADMIN INTERNO

Criar área administrativa do proprietário do SaaS.

Separada da administração das empresas clientes.

Exemplo:

```text
/platform-admin
```

Permitir:

* organizações;
* utilizadores;
* planos;
* assinaturas;
* módulos;
* quotas;
* AI usage;
* storage;
* erros;
* integrações;
* health;
* releases.

Proteção forte.

---

# 54. CUSTOMER HEALTH

Permitir diagnosticar rapidamente conta.

Exemplo:

```text
Empresa: Automatismos Lisboa

Plan: Team
AI: Enabled

Users: 12
Assets: 482
Orders this month: 263

Storage: 3.1 GB
AI: 64%

WhatsApp: healthy
Email: healthy
```

---

# 55. SUPPORTABILITY

Erro apresentado ao utilizador deve ter referência.

Exemplo:

```text
Não foi possível concluir esta operação.
Referência: FP-7K2M9
```

Suporte deve conseguir encontrar logs correspondentes.

---

# 56. LOGGING

Structured logs.

Correlacionar:

* request_id;
* organization_id;
* user_id;
* entity_id.

Nunca registrar:

* passwords;
* secrets;
* tokens;
* dados desnecessariamente sensíveis.

---

# 57. ERROR TRACKING

Antes de vender, integrar solução madura como Sentry ou equivalente.

Capturar:

* frontend;
* backend;
* releases;
* erros server-side;
* integrações.

Com sanitização.

---

# 58. HEALTH CHECKS

Criar monitoramento apropriado para:

* application;
* database;
* storage;
* serviços críticos.

Não expor detalhes sensíveis publicamente.

---

# 59. BILLING

Arquitetura para:

```text
Base Plan
+
Additional Users
+
FieldPilot AI
+
WhatsApp/advanced modules futuramente
```

Não hardcode preço no domínio.

---

# 60. BILLING STATUS

Suportar estados:

```text
trialing
active
past_due
grace_period
suspended
cancelled
```

Não bloquear empresa imediatamente no primeiro erro de cobrança.

---

# 61. STRIPE

Preparar integração Stripe.

Se não houver credenciais:

* provider;
* test/mock;
* database;
* UI;
* webhooks;
* testes;
* feature flag.

Não bloquear restante.

---

# 62. IMPORTAÇÃO

Criar importação CSV profissional para:

* clientes;
* locais;
* equipamentos.

Fluxo:

```text
upload
↓
mapping
↓
validation
↓
preview
↓
import
↓
report
```

Uma linha ruim não deve inutilizar lote inteiro sem necessidade.

---

# 63. EXPORTAÇÃO

Organização deve conseguir exportar dados relevantes.

Formatos:

* CSV;
* JSON;
* ZIP quando necessário.

---

# 64. AUDIT LOG

Registrar ações críticas:

* criação;
* alteração;
* exclusão;
* permissões;
* status;
* approvals;
* completion.

Append-only tanto quanto possível.

---

# 65. SOFT DELETE

Preferir arquivamento/soft-delete para dados históricos importantes.

Exemplos:

* clientes;
* equipamentos;
* utilizadores.

Preservar integridade de relatórios passados.

---

# 66. CONCORRÊNCIA

Evitar overwrites silenciosos.

Utilizar:

* updated_at;
* version;
* optimistic concurrency;

em operações importantes.

---

# 67. IDEMPOTÊNCIA

Obrigatória para:

* webhooks;
* billing;
* WhatsApp;
* geração automática;
* operações assíncronas;
* notificações críticas.

Mesmo evento repetido não cria registros duplicados.

---

# 68. RATE LIMIT

Aplicar onde necessário:

* login;
* reset;
* forms públicos;
* QR;
* APIs públicas;
* IA.

---

# 69. RGPD

Projetar considerando:

* minimização;
* retenção;
* acesso;
* exportação;
* exclusão/anonymização;
* consentimento quando aplicável;
* auditoria.

Não declarar formalmente:

```text
GDPR compliant
ISO certified
100% secure
```

sem validação apropriada.

---

# 70. TIMEZONE

Persistir timestamps corretamente, preferencialmente UTC.

Apresentar Europe/Lisbon inicialmente.

Organizações devem poder ter timezone configurável.

---

# 71. INTERNACIONALIZAÇÃO

Inicial:

```text
pt-PT
```

Preparar para:

```text
pt-BR
en
es
```

Moeda inicial:

```text
EUR
```

Strings devem estar preparadas para i18n.

---

# 72. PERFORMANCE

Priorizar:

* Server Components;
* mínimo client JS;
* pagination server-side;
* imagem otimizada;
* evitar waterfalls;
* lazy loading;
* caching seguro.

Não transformar a app inteira em `"use client"`.

---

# 73. ACESSIBILIDADE

Objetivo mínimo WCAG AA razoável.

Garantir:

* keyboard;
* focus;
* labels;
* aria;
* touch targets;
* contraste;
* reduced motion;
* mensagens compreensíveis.

---

# 74. ESTADOS DE UI

Toda feature deve possuir:

* loading;
* empty;
* success;
* error.

Não deixar tela branca.

---

# 75. MOBILE

No smartphone:

evitar tabelas grandes.

Usar:

* cards;
* lists;
* sheets;
* bottom navigation;
* actions acessíveis.

---

# 76. DESKTOP

Usar:

* sidebar;
* command palette;
* filtros;
* tabelas somente quando adequadas.

Não utilizar DataGrid complexo para listas simples.

---

# 77. LANDING PAGE

Criar site comercial real.

Mensagem baseada em resultado.

Exemplo:

> Da chamada do cliente ao relatório final. Tudo num só lugar.

Subheadline:

> Organize pedidos, técnicos, equipamentos e manutenções sem depender de WhatsApp, Excel e papel.

Criar:

* hero;
* problema;
* benefícios;
* escritório;
* técnico;
* cliente;
* IA opcional;
* QR;
* pricing;
* FAQ;
* CTA.

Não inventar depoimentos.

---

# 78. ONBOARDING

Novo cliente deve conseguir começar sozinho.

Fluxo:

```text
criar conta
↓
organização
↓
dados da empresa
↓
primeiro técnico
↓
primeiro cliente
↓
primeiro equipamento
↓
primeira ordem
```

Progressive disclosure.

---

# 79. DEMO

Criar organização fictícia:

```text
Demo Automatismos Lda.
```

Dados realistas e não pessoais reais.

Seed:

* clientes;
* locais;
* equipamentos;
* técnicos;
* ordens;
* manutenções;
* relatórios.

---

# 80. TESTES UNITÁRIOS

Cobrir lógica real:

* state machine;
* permissions;
* entitlements;
* quotas;
* manutenção;
* parsing;
* validation;
* IA schemas;
* SLA.

Não escrever testes inúteis para inflar coverage.

---

# 81. INTEGRATION TESTS

Cobrir:

* PostgreSQL;
* RLS;
* Auth;
* Storage;
* Work Orders;
* webhooks;
* notifications;
* AI mocked;
* messaging mocked.

---

# 82. CROSS-TENANT TESTS

Obrigatórios.

Criar:

```text
Organization A
Organization B
```

Testar que A não acessa B através de:

* queries;
* APIs;
* URLs;
* Storage;
* mutations;
* portal.

---

# 83. E2E

Playwright deve testar:

## Owner

```text
signup
→ organization
→ customer
→ location
→ asset
→ work order
→ assign technician
```

## Technician

```text
login
→ order
→ start
→ diagnose
→ photo
→ material
→ signature
→ complete
```

## Customer

```text
login
→ asset
→ request
→ track
→ report
```

## QR

```text
token
→ asset
→ request
```

## Security

Tentativas de acesso sem permissão.

---

# 84. TESTAR COMO 10 UTILIZADORES

Antes de releases importantes, testar mentalmente e/ou via browser como:

1. dono;
2. administrativo;
3. dispatcher;
4. técnico experiente;
5. técnico pouco tecnológico;
6. cliente empresarial;
7. condomínio;
8. mobile com rede ruim;
9. utilizador malicioso;
10. novo utilizador sem dados.

Corrigir fricção encontrada.

---

# 85. PERFORMANCE TESTING

Executar Lighthouse ou equivalente.

Objetivos aproximados:

```text
Performance >= 90
Accessibility >= 95
Best Practices >= 95
SEO >= 95
```

Corrigir causas reais.

---

# 86. CI

GitHub Actions deve executar, quando aplicável:

```text
install
lint
typecheck
unit
integration
build
e2e
```

Main não pode ficar vermelha.

---

# 87. DEPENDÊNCIAS

Antes de adicionar package:

pergunte internamente:

> precisamos realmente disso?

Preferir plataforma/framework existente.

Commitar lockfile.

Executar auditoria.

Remover dependências não usadas.

---

# 88. DATABASE MIGRATIONS

Toda mudança no banco deve ter migration versionada.

Produção terá dados reais.

Nunca depender de:

```text
reset database
```

como processo normal.

Migrations devem ser incrementais e seguras.

---

# 89. MIGRATIONS COMPATÍVEIS

Para alteração grande:

```text
adicionar novo
↓
suportar antigo + novo
↓
migrar dados
↓
validar
↓
remover antigo em release posterior
```

Evitar mudanças destrutivas simultâneas.

---

# 90. BACKUPS

Criar:

```text
docs/BACKUP_AND_RECOVERY.md
```

Documentar:

* backup DB;
* storage;
* retenção;
* restore;
* RPO;
* RTO.

Não assumir capabilities de plano sem verificar.

---

# 91. DISASTER RECOVERY

Documentar resposta para:

* DB down;
* Storage down;
* bad deploy;
* bad migration;
* OpenAI down;
* Meta down;
* email down.

Providers opcionais não devem derrubar core.

---

# 92. AMBIENTES

Separar:

```text
local
preview/staging
production
```

Nunca usar DB de produção para desenvolvimento normal.

---

# 93. ENV VARIABLES

Criar:

```text
.env.example
```

Grupos:

```text
APP
SUPABASE
OPENAI
RESEND
META
STRIPE
MONITORING
```

Secrets nunca no Git.

---

# 94. FEATURE FLAGS

Centralizar.

Exemplos:

```text
AI_ENABLED
WHATSAPP_ENABLED
BILLING_ENABLED
CUSTOMER_PORTAL_ENABLED
```

Também permitir flags por organização.

---

# 95. RELEASE PROCESS

Cada release deve seguir:

```text
feature complete
↓
tests
↓
lint
↓
typecheck
↓
build
↓
docs updated
↓
merge main
↓
production deploy
↓
production smoke test
↓
CHANGELOG
↓
branch delete
```

---

# 96. NÃO DEIXAR BRANCHES ESPALHADAS

Ao final de cada ciclo:

1. listar branches;
2. identificar merged;
3. excluir merged;
4. identificar abandonadas;
5. preservar somente trabalho realmente ativo.

Objetivo:

```text
main
+
no máximo poucas branches de trabalho atuais
```

---

# 97. COMMITS

Commits pequenos e claros.

Exemplos:

```text
feat: add customer onboarding
feat: add asset QR flow
fix: enforce tenant storage isolation
test: add technician work order e2e
docs: update production recovery procedure
```

Não criar commit genérico:

```text
changes
fix
update
stuff
```

---

# 98. PROGRESSO DOCUMENTADO NO REPOSITÓRIO

Depois de cada vertical slice, `docs/AI_HANDOFF.md` deve responder claramente:

```text
Onde estamos?
O que funciona?
O que acabou de mudar?
Qual versão está em produção?
Qual é a próxima tarefa?
Existe algum bloqueio?
```

Outra IA deve conseguir entrar no repositório e continuar sem me perguntar:

> "O que já foi feito?"

---

# 99. SE OUTRA IA ASSUMIR

Ao iniciar trabalho em repositório existente:

ANTES de alterar código:

1. ler `docs/AI_HANDOFF.md`;
2. ler `README.md`;
3. ler `docs/ARCHITECTURE.md`;
4. verificar Git;
5. verificar branches;
6. verificar CI;
7. verificar últimas migrations;
8. executar testes;
9. executar build;
10. verificar produção.

Depois continuar do ponto registrado.

NÃO recriar projeto.

NÃO substituir arquitetura sem motivo técnico comprovado.

---

# 100. SE DOCUMENTAÇÃO E CÓDIGO DIVERGIREM

Código em produção é realidade.

Investigue.

Corrija documentação imediatamente.

Se o código estiver errado, corrija código.

Nunca continuar construindo sobre suposição incorreta.

---

# 101. NÃO REESCREVER O QUE JÁ FUNCIONA

Antes de substituir componente/serviço:

verifique:

* realmente existe problema?
* ganho compensa risco?
* testes cobrem?
* haverá regressão?

Evitar reescritas por preferência pessoal de outra IA.

---

# 102. SECURITY REVIEW

Antes de considerar versão vendável:

verificar:

* auth;
* RLS;
* IDOR/BOLA;
* XSS;
* CSRF quando aplicável;
* redirects;
* file uploads;
* signed URLs;
* rate limiting;
* webhook signatures;
* secrets;
* sessions;
* logs;
* tenant isolation;
* portal;
* QR tokens.

---

# 103. PRODUÇÃO SEM INTERVENÇÃO MANUAL

Imagine:

```text
50 empresas
centenas de técnicos
milhares de equipamentos
centenas de ordens diárias
```

O sistema não pode depender de eu abrir SQL para corrigir tudo.

Criar:

* validações;
* constraints;
* admin;
* logs;
* monitoring;
* recovery;
* retries;
* idempotência.

---

# 104. CRITÉRIO DE DONE DE UMA FEATURE

Feature não está pronta até possuir, quando aplicável:

```text
[ ] database
[ ] RLS
[ ] server logic
[ ] UI
[ ] responsive
[ ] loading
[ ] empty
[ ] error
[ ] permissions
[ ] validation
[ ] tests
[ ] documentation
[ ] build
[ ] production
[ ] smoke test
```

---

# 105. ORDEM DE DESENVOLVIMENTO

Execute autonomamente.

## Fase 0 — Auditoria inicial

Se projeto já existir:

* analisar repo;
* branches;
* arquitetura;
* dependências;
* deploy;
* banco;
* testes;
* documentação.

Se não existir:

criar.

---

## Fase 1 — Fundação

Criar:

* PRD;
* architecture;
* AI_HANDOFF;
* design system;
* test setup;
* CI;
* environments.

Publicar primeira shell utilizável.

---

## Fase 2 — Auth + Organizations

Implementar completamente.

Deploy.

Testar.

Documentar.

---

## Fase 3 — Customers

Implementar completamente.

Deploy.

Testar.

Documentar.

---

## Fase 4 — Locations

Completo.

Deploy.

---

## Fase 5 — Assets

Completo.

Incluindo QR quando adequado.

Deploy.

---

## Fase 6 — Service Requests

Completo.

Deploy.

---

## Fase 7 — Work Orders

Completo.

Deploy.

---

## Fase 8 — Dispatch + Calendar

Completo.

Deploy.

---

## Fase 9 — Technician PWA

Completo.

Deploy.

---

## Fase 10 — Media + Signatures

Completo.

Deploy.

---

## Fase 11 — Reports

Completo.

Deploy.

---

## Fase 12 — Customer Portal

Completo.

Deploy.

---

## Fase 13 — Preventive Maintenance

Completo.

Deploy.

---

## Fase 14 — Import/Export

Completo.

Deploy.

---

## Fase 15 — FieldPilot AI

Implementar módulo completo mas separado.

Core continua independente.

Deploy feature flag.

---

## Fase 16 — WhatsApp

Implementar provider e fluxo.

Se credencial existir, ativar.

Caso contrário deixar tecnicamente pronto e desativado.

---

## Fase 17 — Billing

Implementar.

---

## Fase 18 — Platform Admin

Completo.

---

## Fase 19 — Observability

Completo.

---

## Fase 20 — Security Hardening

Completo.

---

## Fase 21 — Commercial Release Review

Executar release gate.

---

# 106. RELEASE GATE ANTES DE VENDER

Todos os itens críticos:

```text
[ ] signup
[ ] onboarding
[ ] customer management
[ ] asset management
[ ] requests
[ ] work orders
[ ] technician PWA
[ ] reports
[ ] customer portal
[ ] preventive maintenance
[ ] import/export

[ ] RLS
[ ] cross-tenant tests
[ ] secure storage
[ ] upload validation
[ ] rate limiting
[ ] audit logs

[ ] admin
[ ] monitoring
[ ] error tracking
[ ] logging
[ ] backups documented
[ ] recovery documented

[ ] billing
[ ] entitlements
[ ] FieldPilot AI isolated
[ ] AI quotas
[ ] AI usage metering

[ ] lint
[ ] typecheck
[ ] unit tests
[ ] integration tests
[ ] E2E
[ ] build
[ ] accessibility
[ ] performance

[ ] staging
[ ] production
[ ] production smoke tests

[ ] README
[ ] AI_HANDOFF
[ ] SECURITY
[ ] DEPLOYMENT
[ ] TESTING
[ ] COSTS
```

Falha crítica significa:

**ainda não está pronto para venda.**

---

# 107. DEFINIÇÃO DE PRODUTO PRONTO

Uma empresa deve conseguir:

1. criar conta;
2. criar organização;
3. configurar empresa;
4. convidar equipa;
5. importar clientes;
6. criar cliente;
7. adicionar local;
8. adicionar equipamento;
9. gerar QR;
10. criar pedido;
11. criar ordem;
12. agendar;
13. atribuir técnico;
14. técnico usar smartphone;
15. iniciar intervenção;
16. diagnosticar;
17. adicionar fotos;
18. adicionar materiais;
19. recolher assinatura;
20. finalizar;
21. gerar relatório;
22. cliente acessar portal;
23. consultar histórico;
24. programar manutenção;
25. exportar dados;
26. pagar assinatura;
27. adicionar módulo FieldPilot AI quando quiser.

---

# 108. PRODUTO VENDÁVEL

Além da funcionalidade, deve existir:

* landing page;
* pricing;
* signup;
* trial;
* onboarding;
* login;
* password recovery;
* contato/suporte;
* privacy placeholder para revisão jurídica;
* terms placeholder para revisão jurídica;
* billing;
* administração da plataforma;
* monitoring.

Não inventar textos jurídicos como definitivamente válidos.

Marcar claramente necessidade de revisão jurídica quando aplicável.

---

# 109. CUSTOS

Criar:

```text
docs/COSTS.md
```

Registrar custos atuais e estimados:

* Vercel;
* Supabase;
* Resend;
* Meta;
* OpenAI;
* Stripe;
* monitoring.

Separar:

```text
fixo
variável
por cliente
por utilização
```

Especial atenção ao custo do FieldPilot AI.

---

# 110. NÃO FAÇA OVERENGINEERING

NÃO adicionar sem necessidade comprovada:

* microservices;
* Kubernetes;
* Kafka;
* Elasticsearch;
* CQRS complexo;
* event sourcing;
* GraphQL;
* Redis;
* multi-cloud.

Começar simples.

Projetar bem.

Escalar quando necessário.

---

# 111. NÃO OTIMIZAR PREMATURAMENTE

Mas também não implementar coisas obviamente incapazes de crescer.

Utilizar desde o início:

* pagination;
* indexes adequados;
* object storage;
* background processing quando realmente necessário;
* idempotência;
* multi-tenant.

---

# 112. QUALIDADE DE CÓDIGO

TypeScript strict.

Evitar:

```text
any
duplicate types
magic strings
large god-components
large god-services
```

Funções e componentes devem ter responsabilidade clara.

---

# 113. REFATORAÇÃO

Refatore quando:

* duplicação ficou relevante;
* complexidade impede evolução;
* bug demonstra desenho problemático.

Não refatore apenas por estética enquanto features comerciais estão incompletas.

---

# 114. PRIORIDADE

Quando houver conflito entre:

```text
arquitetura perfeita
vs
produto comercial robusto e simples
```

escolha o segundo.

Quando houver conflito entre:

```text
efeito visual
vs
usabilidade
```

escolha usabilidade.

Quando houver conflito entre:

```text
feature nova
vs
bug crítico
```

corrija bug.

Quando houver conflito entre:

```text
velocidade
vs
segurança de dados
```

escolha segurança.

---

# 115. RESULTADO QUE ESPERO DE VOCÊ

Você deve trabalhar continuamente seguindo este ciclo:

```text
LER ESTADO
↓
ESCOLHER PRÓXIMA PRIORIDADE
↓
IMPLEMENTAR
↓
TESTAR
↓
CORRIGIR
↓
ATUALIZAR AI_HANDOFF
↓
COMMIT
↓
MERGE MAIN
↓
DEPLOY PRODUÇÃO
↓
TESTAR PRODUÇÃO
↓
APAGAR BRANCH
↓
REGISTRAR CHANGELOG
↓
PRÓXIMA PRIORIDADE
```

---

# 116. O QUE VOCÊ NÃO DEVE FAZER

Não pare depois de criar scaffold.

Não pare depois da landing page.

Não pare depois do banco.

Não pare depois do frontend.

Não pare depois do deploy inicial.

Não me entregue instruções para eu implementar.

Você implementa.

Não me peça para decidir detalhes triviais.

Você decide.

Não deixe branches inúteis.

Você limpa.

Não deixe código morto.

Você remove.

Não deixe documentação desatualizada.

Você atualiza.

Não deixe feature incompleta na produção.

Você termina antes de integrar.

---

# 117. BLOQUEIO EXTERNO

Se realmente precisar de mim, reporte somente assim:

```text
BLOQUEIO EXTERNO

O que falta:
<uma informação/ação específica>

Por que somente eu posso resolver:
<razão>

O que já está pronto:
<estado>

O que acontecerá depois que eu resolver:
<ação automática seguinte>
```

Não transforme isso em uma lista de 20 perguntas.

---

# 118. RELATÓRIO DE CADA RELEASE

Ao concluir uma vertical slice, registre no `AI_HANDOFF.md` e informe resumidamente:

```text
Release:
<versão>

Implementado:
<features>

Testes:
<estado>

Produção:
<estado>

Branch:
<apagada/manter com motivo>

Próximo:
<única prioridade seguinte>
```

---

# 119. REGRA MAIS IMPORTANTE DE CONTINUIDADE

Assuma que você pode ser substituído por outra IA a qualquer momento.

Seu trabalho deve permanecer compreensível através do próprio repositório.

Nenhuma decisão essencial pode existir apenas:

* nesta conversa;
* na sua memória;
* em raciocínio interno.

Tudo necessário para continuar deve estar:

* no código;
* nos testes;
* nas migrations;
* ou na documentação do repo.

---

# 120. PRINCÍPIO FINAL

Construa como se amanhã:

* 50 empresas pagassem pelo produto;
* 300 técnicos dependessem dele;
* clientes estivessem enviando pedidos;
* relatórios fossem documentos importantes;
* eu não estivesse disponível para corrigir banco manualmente.

O FieldPilot deve ser:

**simples de vender.**

**simples de utilizar.**

**simples de manter.**

**difícil de quebrar.**

**fácil de investigar quando algo falhar.**

**barato no início.**

**capaz de crescer.**

Não quero uma demo bonita.

Quero um produto real.

COMECE AGORA.
