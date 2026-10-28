# Panorama completo do admin

O dashboard consulta `GET /reports/summary`. O total superior soma os registros
das 15 áreas de conteúdo, enquanto o carrossel abaixo apresenta os indicadores
com atalhos às respectivas listagens. Os filtros **Todos**, **Acervo**,
**Atividades** e **Comunicação** mudam os cartões visíveis; não mudam o total geral.

| Chave da API | Indicador |
| --- | --- |
| `people` | Pessoas ativas, incluindo participantes externos |
| `books` | Livros |
| `articles` | Artigos (`ARTICLE`) |
| `dossiers` | Dossiês editoriais (`DOSSIER` de Article) |
| `news` | Notícias |
| `meetings` | Encontros, seminários e mostras, em todos os tipos de Meeting |
| `juries` | Júris históricos |
| `boards` | Bancas |
| `presentedWorks` | Trabalhos apresentados |
| `research` | Pesquisas (modelo Search) |
| `researchInstruments` | Todos os instrumentos: dossiês, catálogos e bancos de dados |
| `thematics` | Linhas temáticas |
| `videos` | Vídeos |
| `schedule` | Agenda |
| `newsletters` | Newsletters, incluindo edições em preparação |

A API exclui registros com `deletedAt` preenchido. Para pessoas, exige também
`isActive=true`, preservando a regra anterior de contagem. Vínculos, imagens,
comentários, notificações, usuários de acesso, destinatários e entregas não são
somados como conteúdo do portal. Os subtipos de eventos/instrumentos não são
somados novamente, evitando duplicação no panorama.

O carrossel usa Swiper, com arraste, botões anterior/próximo, indicação dos itens
visíveis e acesso por teclado aos controles e cartões. Adapta-se à largura do
próprio componente, inclusive quando o sidebar muda de tamanho. Não há avanço
automático. O filtro selecionado começa no primeiro cartão.

Zero é exibido como zero. Uma contagem ausente/indisponível aparece como `—`,
sem simular ausência de registros. Falhas no relatório preservam o botão de
nova tentativa. Agenda e notícias recentes continuam com carregamento próprio
do dashboard.

Os dados são renovados ao receber foco, ao voltar à aba e a cada 30 segundos
enquanto a página está visível. Requisições simultâneas são evitadas e consultas
pendentes são canceladas ao sair da tela. O resumo usa `Cache-Control` para não
reaproveitar uma resposta antiga. O processo da API também precisa estar com a
versão atual em execução: `yarn start` não recarrega alterações; após um build,
reinicie-o ou use `yarn start:dev` durante o desenvolvimento.

Não é necessária migration. Front e API devem ser atualizados juntos para
mostrar os nove novos indicadores com os respectivos valores.

Validação: `npm run test:admin` e `npm run build` no front; testes de
`src/reports` e build na API.
