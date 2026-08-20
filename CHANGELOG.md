# Changelog

Este projeto segue [Semantic Versioning](https://semver.org/).

## [0.2.0] - Unreleased

### Added

- autenticação SSR com cadastro, confirmação de email, login, logout e recuperação de palavra-passe;
- onboarding que cria a organização e o membership Owner numa única transação;
- painel protegido com estado inicial real da empresa;
- tabelas `profiles`, `organizations`, `organization_members` e `invitations`;
- RLS e privilégios explícitos para leitura e escrita isoladas por tenant;
- testes unitários de validação/redirecionamento e suíte SQL cross-tenant;
- workflow protegido para aplicar migrations, testar RLS e executar lint/advisors remotos;

### Changed

- landing pública agora conduz para cadastro e início de sessão reais;
- configuração pública do Supabase usa publishable key em vez da legacy anon key.
- CSP limita ligações externas ao projeto Supabase exclusivo do FieldPilot.

## [0.1.0] - 2026-08-20

### Added

- shell comercial responsiva com identidade visual FieldPilot;
- temas claro, escuro e sistema;
- apresentação dos fluxos de escritório, terreno e cliente;
- manifest e metadados para instalação futura como PWA;
- endpoint de health check;
- configuração de Vitest, Testing Library e Playwright;
- pipeline de CI para lint, tipos, testes e build;
- documentação técnica, operacional e de continuidade.
