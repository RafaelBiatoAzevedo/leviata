# Observatório — configuração e operação

Acesso: **Admin → Observatório**, logo abaixo de Dashboard, em
`/admin/observatorio`. ADMIN e SUPER_ADMIN usam os mesmos JWTs, verificação de
conta ativa, revogação e AdminGuard do sistema. Leia também a
[decisão de arquitetura](analytics-decision.md), com fontes oficiais consultadas.

## Entrega e métricas

Coletor anônimo, provider PostgreSQL substituível e relatório agregado no NestJS;
gráfico por dia, blocos de sete dias ou mês; exploração por mouse/teclado; filtros
hoje/7/30/90 dias e intervalo de até 90 dias dentro da janela de 180 dias.

O painel mostra visualizações, média diária, dias com acessos, áreas alcançadas,
rankings de páginas/seções, origens, navegadores e dispositivos, além de leituras
editoriais derivadas dos números. Temas claro/escuro, layout responsivo, skeleton,
estados de configuração/erro/vazio/cota e CSV com escape e proteção contra fórmulas.
O código da página carrega sob demanda, sem adicionar o painel ao bundle público.

**Sessões, visitantes únicos, páginas/sessão, países e presença online não são
medidos.** Não há dados anteriores à ativação. Páginas dinâmicas são agrupadas por
modelo (`/noticias/:id`), sem ranking individual que exponha nomes ou slugs.
Origem é uma categoria fechada; referências desconhecidas viram “Outros sites”.
A referência de entrada do documento acompanha as navegações SPA desse documento.

Comparação percentual só aparece com dois períodos elegíveis de mesma duração:
sem o dia atual, posteriores ao primeiro dia registrado, dentro da janela e sem
mês limitado. Base anterior zero não produz porcentagem. Ausência de eventos não
prova operação contínua: bloqueadores e falhas afetam ambos os períodos.

## Implantação — passos ainda necessários

Nenhuma configuração real, migration de ambiente ou ativação foi executada.
Os dois lados vêm desativados. Não é necessária nova conta ou integração paga.

1. Confira capacidade e cotas do servidor/banco, finalidade e transparência da
   coleta. Logs de hospedagem/proxy são separados e podem registrar IPs e URLs.
2. No **leviata-api**, revise e aplique a migration aditiva pelo fluxo habitual:

   ```sh
   npx prisma migrate deploy
   npx prisma generate
   npm run build
   ```

   A migration `20261028220000_add_anonymous_analytics` só cria `AnalyticsEvent`,
   índice por dia e `AnalyticsMonth`. Não altera dados de conteúdo ou contas.
3. Publique o backend atualizado com as variáveis de `.env.analytics.example`:

   ```dotenv
   ANALYTICS_ENABLED=true
   ANALYTICS_ALLOWED_ORIGINS=https://leviataeocativeiro.com.br,https://www.leviataeocativeiro.com.br
   ANALYTICS_MONTHLY_LIMIT=10000
   ANALYTICS_TRUST_PROXY_HOPS=0
   ```

   Origens exatas, separadas por vírgulas, sem barra final, caminho ou `*`.
   HTTPS é obrigatório em produção. Não habilite previews indiscriminadamente.
   A cota aceita 100–100.000 eventos/mês. Configuração inválida desativa analytics
   sem impedir o CMS de iniciar.

   Proxy hops aceita 0–2. Use 0 em conexão direta; informe 1 ou 2 somente após
   verificar a cadeia de proxies confiáveis e impedir acesso direto que permita
   falsificá-la. Caso contrário, clientes atrás do proxy compartilham o limite.
4. No **leviata**, configure e faça novo build/publicação:

   ```dotenv
   VITE_API_BASE_URL=https://ENDERECO-REAL-DA-API
   VITE_ANALYTICS_ENABLED=true
   ```

   Vite incorpora essas variáveis no build. Não há token de analytics no browser.
   Localmente, use API `http://localhost:3000` e origem permitida
   `http://localhost:5173`. Não envie tráfego de desenvolvimento à API de produção.
5. Agende a manutenção de retenção no mecanismo operacional existente, por
   exemplo uma execução diária, **no diretório da API**:

   ```sh
   node scripts/analytics-retention.cjs
   ```

   Usa `DATABASE_URL` do ambiente e só exclui analytics anterior à janela, em
   lotes, até 100 mil registros por execução. O coletor também elimina até cinco
   mil registros por minuto com tráfego. Sem tráfego nem manutenção, registros
   antigos podem permanecer fisicamente no banco, mas nunca são consultáveis.
   Reexecute se houver backlog. O agendamento não é instalado automaticamente
   e pode acordar o Neon.

## Contratos e segurança

`POST /analytics/collect` é público, separado das leituras, sem cookies/JWT:

```json
{"id":"UUID-V4-POR-VISUALIZACAO","path":"/noticias/:id","source":"google"}
```

Só aceita esses três campos e dimensões permitidas. O servidor determina o dia
em São Paulo, tipo de dispositivo e família do navegador. Origem inválida: 403;
payload inválido: 400; limite local/mensal: 429; armazenamento indisponível: 503.
Desativado, bots conhecidos ou DNT/GPC: descarte com 204. O frontend espera 350 ms,
somente com documento visível, cancela ao navegar e não repete query/hash ou
rerender. Falhas não bloqueiam o portal nem provocam retries automáticos.

`GET /analytics/report?from=YYYY-MM-DD&to=YYYY-MM-DD` exige JWT + AdminGuard.
Retorna status `ready`, `not_configured`, `unavailable` ou `quota_reached`, cota,
metadados e `data`. Sem configuração/conexão, `data: null`; ativo e sem eventos,
totais zero. Métricas não suportadas são `null`. Datas impossíveis/futuras,
intervalos acima de 90 dias ou fora da janela e campos extras são rejeitados.

Cache interno de cinco minutos, 32 intervalos e quatro consultas simultâneas;
falhas em cache por 15 segundos. Atualização manual respeita o cache.
`generatedAt` é a hora do snapshot, não a hora do último visitante. HTTP privado
com `no-store`. Timeouts SQL de 2–3 segundos e transações de 3–5 segundos.

Cota atômica em mês civil de São Paulo, compartilhada por réplicas. UUID repetido
não incrementa a cota; transação acima do teto é revertida. Meses que atingem o
limite permanecem sinalizados. Aumentar a cota não reconstitui acessos perdidos.

Rate limit: 120 eventos/minuto por endereço de rede, 600/minuto por processo,
quatro gravações simultâneas. Chaves de rede são HMACs efêmeros em memória,
somente para limitação; não entram nas estatísticas. Proteção distribuída deve
ser configurada na borda. Origin pode ser falsificado por clientes externos e
bots podem se disfarçar; não há garantia de tráfego humano.

Não são armazenados IP, User-Agent completo, identificador de visitante/sessão,
título, nome, e-mail, busca ou parâmetros de URL. Preferência no rodapé respeita
opt-out, DNT e GPC. O único estado persistido no navegador é a preferência local.
UUID identifica uma visualização, não uma pessoa. Nenhum secret é exposto no UI,
respostas ou logs do módulo. Isso não substitui a avaliação LGPD do responsável.

## Operação e desativação

Monitore armazenamento, compute, tráfego, 429/503 e cota. Analytics compartilha
recursos com o CMS; os limites não garantem ausência de cobrança da infraestrutura.
Não há contratação/upgrade automático. Interrompa gravações com
`ANALYTICS_ENABLED=false` e reinicie/republique a API; interrompa envios com novo
build frontend usando `VITE_ANALYTICS_ENABLED=false`. Tabelas ficam preservadas.

## Validação

Frontend:

```sh
npm run build
npm run lint
npm run test:analytics
npm run test:admin
npm run test:navigation
npm run test:portal
npm run test:theme
npm run test:news
npm run test:analytics:browser
```

Browser QA usa Chrome e Puppeteer já instalado no workspace da API, Vite isolado
na porta 5187 e API mock local. Fixtures só existem nos testes. Screenshots:
`/tmp/leviata-analytics-qa`. Verifica proteção da rota, menu, teclado, datas,
responsividade, temas, estados, SPA, transporte e opt-out.

Os scripts de teste existentes devem ser executados individualmente. Agrupar
todos os arquivos em um único processo compartilha mocks e causa interferência
entre os harnesses antigos; alguns arquivos também dependem do agrupamento
definido no seu script de `package.json`.

API:

```sh
npm run build
npx prisma validate
npm run test:analytics
npx eslint src/analytics src/app.module.ts
ANALYTICS_TEST_DATABASE_URL=postgresql://USUARIO@localhost:PORTA/BANCO_DESCARTAVEL npm run test:analytics:integration
```

O teste SQL nunca usa `DATABASE_URL`: exige a variável específica, cria um schema
aleatório e o remove ao terminar. Verifica migration, SQL real, deduplicação
concorrente, cota atômica/rollback, retenção e colunas sem PII.

### Resultado da implementação, concluído em 29/10/2026

- Builds do frontend e da API aprovados; schema Prisma válido.
- 260 testes de frontend aprovados: os 19 scripts unitários de `package.json`,
  executados separadamente, mais comentários/notificações e editor de imagem.
- 17 testes novos da API aprovados, incluindo JWT real, revogação, roles,
  validação de filtros/payload, privacidade, cota e cache.
- Integração aprovada em PostgreSQL 18 temporário: migration, agregações SQL,
  deduplicação concorrente, teto mensal atômico, rollback e as duas formas de
  limpeza de retenção, incluindo o comando de manutenção.
- Chrome local: rota privada, menu, teclado, filtros, responsividade, temas,
  configuração/vazio/indisponibilidade/cota, SPA, URLs sensíveis e opt-out.
- Lint dos arquivos TypeScript alterados aprovado nos dois projetos. O lint
  geral do frontend mantém quatro erros em arquivos anteriores: dois em
  `AdminDataContext.tsx` e um em cada `ModalProvider.tsx`/`ToastProvider.tsx`.
- Suíte geral da API: 359 testes aprovados e 25 falhas em 18 suítes antigas.
  Uma cópia temporária do HEAD anterior apresentou exatamente as mesmas falhas
  (342 aprovados, 25 falhas). Não foram reescritos testes ou módulos alheios.

Nenhum evento foi inserido no banco do projeto. Screenshots com números usam
somente fixtures da API mock isolada; não representam audiência real.

## Conferência após publicar

- [ ] Sem login, rota do admin redireciona; GET do relatório retorna 401.
- [ ] ADMIN e SUPER_ADMIN veem Observatório abaixo de Dashboard.
- [ ] Uma visita pública envia somente UUID, modelo de rota e categoria de origem.
- [ ] Rerender, query/hash e admin não geram acessos extras.
- [ ] Filtros e gráfico funcionam com teclado, no celular e nos dois temas.
- [ ] Opt-out/DNT/GPC bloqueiam novos envios; coletor sem cookies/JWT.
- [ ] Primeiro acesso aparece após o cache; não há histórico anterior inventado.
- [ ] Datas, CSV e cota conferem com eventos aceitos no fuso de São Paulo.
- [ ] Retenção agendada e consumo do banco monitorado.
- [ ] Fluxo do logo, conteúdo, portal, autenticação e CMS preservados.
