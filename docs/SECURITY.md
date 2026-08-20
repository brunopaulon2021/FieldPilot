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

## Implementado na fundação

Headers `nosniff`, `DENY` para frames, referrer restrito, permissions policy conservadora, header de framework removido e workflow com `contents: read`.

## Antes de produção

Adicionar CSP baseada em hosts reais, threat model, testes cross-tenant, secret scan, dependency audit, política de retenção RGPD e revisão manual do conjunto de policies.

## Reporte responsável

Durante a fase privada, vulnerabilidades devem ser comunicadas diretamente ao owner do repositório, sem issue pública contendo detalhes exploráveis.
