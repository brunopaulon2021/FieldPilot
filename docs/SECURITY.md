# Security

## Princípios

Menor privilégio, deny-by-default, validação no servidor, isolamento multi-tenant e logs auditáveis. Segurança não depende de componentes ocultos no frontend.

## Regras obrigatórias

- nunca expor `SUPABASE_SERVICE_ROLE_KEY` ao browser;
- buckets privados, signed URLs curtas, validação de MIME e tamanho;
- RLS em todas as entidades de negócio;
- autorização por membership e role server-controlled;
- Zod em todas as entradas não confiáveis;
- rate limiting em auth, uploads, convites, QR público e endpoints de IA;
- proteção CSRF/origin em mutations baseadas em cookie;
- idempotency keys em webhooks e operações repetíveis;
- secrets apenas nos gestores de ambiente;
- logs sem tokens, passwords, conteúdo sensível ou PII desnecessária.

## Implementado

Headers `nosniff`, `DENY` para frames, referrer restrito, permissions policy conservadora, header de framework removido e workflow com `contents: read`.

Na Fase 2:

- sessão SSR renovada no `proxy.ts` e identidade validada server-side com `getClaims()`;
- redirects de Auth limitados a caminhos locais;
- entradas de cadastro, login, recuperação e organização validadas por Zod no servidor;
- mensagens do provedor sanitizadas antes de chegar à UI;
- publishable key permitida no browser e nenhuma service-role key requerida;
- RLS nas quatro tabelas públicas e acesso deny-by-default;
- funções `security definer` no schema privado, com `search_path` vazio e grants mínimos;
- role obtida apenas de `organization_members`, nunca de `user_metadata`;
- palavra-passe mínima de 12 caracteres e confirmação de email habilitada na configuração local.

## Antes de produção

Adicionar CSP baseada nos hosts do novo projeto Supabase, threat model, rate limiting adicional para convites, secret scan contínuo, política de retenção RGPD e audit log. Antes de ativar a Fase 2 em produção, aplicar a migration num projeto exclusivo, executar a suíte cross-tenant e rever os advisors de segurança/performance.

## Reporte responsável

Durante a fase privada, vulnerabilidades devem ser comunicadas diretamente ao owner do repositório, sem issue pública contendo detalhes exploráveis.
