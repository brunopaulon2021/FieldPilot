# Architecture

## Estilo

Monólito modular Next.js com fronteiras de domínio. É a opção de menor complexidade para o estágio inicial e suporta escala vertical e horizontal na Vercel sem introduzir microserviços prematuros.

## Camadas

1. **Presentation**: Server e Client Components, acessíveis e responsivos.
2. **Application**: casos de uso e autorização explícita.
3. **Domain**: regras puras, state machines, entitlements e validações.
4. **Infrastructure**: Supabase, email, messaging, AI, billing e observabilidade por adapters.

Dependências apontam para dentro: domínio não importa UI nem SDKs de providers.

## Runtime

Node.js por padrão. Edge apenas quando houver ganho comprovado e compatibilidade total. Server Components são preferidos; Client Components ficam restritos a interação real.

## Multi-tenancy

Shared database e shared schema. `organization_id` em toda entidade tenant-owned. RLS é defesa obrigatória, mas cada caso de uso também verifica membership e role. URLs não são fronteira de segurança.

## Providers

- `StorageProvider`: Supabase Storage;
- `EmailProvider`: Resend;
- `MessagingProvider`: Meta WhatsApp Cloud API;
- `AIProvider`: OpenAI;
- billing: Stripe;
- error tracking: provider a decidir na Fase 19.

Providers opcionais devem falhar de modo controlado e nunca interromper o core.

## Evolução

Separar um módulo em serviço só quando houver medição que justifique isolamento operacional, escala independente ou requisito de segurança incompatível com o monólito.
