# Known Limitations

Estado em 2026-08-20:

- Auth, Organizations e a primeira vertical de Customers + Customer Locations estão implementadas; equipamentos, pedidos, ordens de trabalho, agenda e relatórios ainda não estão;
- confirmação de email e recuperação precisam de smoke test com uma caixa de correio real;
- clientes suportam arquivo reversível, mas contactos separados e eliminação/arquivo de locais ainda não pertencem a este slice;
- pesquisa de clientes cobre o nome e limita a carteira carregada a 100 registos; paginação avançada entra quando houver volume real;
- previews Vercel permanecem protegidos e produção pública;
- o manifest existe, mas offline/sync pertencem à Fase 9 da PWA do técnico;
- ainda não existe imagem Open Graph própria;
- Resend, WhatsApp, OpenAI e integrações ERP continuam opcionais e ainda não estão ligadas.

Itens acima não são exibidos como funcionalidades prontas na interface.
