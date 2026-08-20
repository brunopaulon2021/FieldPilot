# Deployment

## Ambientes

- local: desenvolvimento individual;
- preview: branch/PR na Vercel, Supabase separado quando migrations forem introduzidas;
- production: `main`, Vercel e projeto Supabase de produção.

## Pipeline

Branch curta → CI → revisão → merge em `main` → deploy automático → smoke test → remoção da branch.

## Configuração Vercel

- Framework Preset: Next.js;
- Build Command: `pnpm build`;
- Install Command: `pnpm install --frozen-lockfile` depois de o lockfile existir;
- Node.js: 24;
- variáveis conforme `.env.example`, separadas por ambiente.

Variáveis necessárias para Auth:

- `APP_URL`: URL canónica do ambiente;
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto exclusivo FieldPilot;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: publishable key pública.

Os previews permanecem protegidos. A produção é pública por decisão do owner. As migrations são aplicadas no Supabase antes de promover o frontend que depende delas.

## Smoke test

Após cada deploy: abrir produção, validar o fluxo alterado, mobile quando relevante, console, requests e `/api/health`. Deploy concluído não equivale a feature concluída.

## Rollback

Em regressão grave, promover imediatamente o último deployment saudável na Vercel, preservar logs/evidências, corrigir em branch, validar e publicar nova versão. Não investigar durante horas com produção quebrada.

## Estado

Produção ativa e pública: `https://field-pilot-brunopaulon2021s-projects.vercel.app/`.

O deploy automático acompanha `main`. A Fase 2 usa exclusivamente o projeto Supabase FieldPilot `pbhjphqimvoffgdtwcer`; o projeto Supabase do Mandy's permanece separado e não pode ser reutilizado.

A Site URL do Supabase aponta para a produção pública. A allowlist inclui os callbacks de onboarding e recuperação, os previews protegidos da equipa Vercel e `localhost:3000` para desenvolvimento.
