# Known Limitations

Estado em 2026-08-20:

- somente a Fase 1 está implementada; ainda não há auth nem funcionalidades de operação;
- o registry npm não estava acessível no ambiente inicial, então falta gerar e versionar `pnpm-lock.yaml`; o CI do primeiro branch deve validar resolução, lint, tipos, testes e build;
- a aplicação ainda não está ligada à Vercel ou Supabase;
- CSP completa aguarda os hosts reais;
- o manifest existe, mas offline/sync pertencem à Fase 9 da PWA do técnico;
- ainda não existe imagem Open Graph própria;
- integrações externas estão apenas decididas e documentadas, sem credenciais.

Itens acima não são exibidos como funcionalidades prontas na interface.
