# Eventos, simpósios e vínculos da agenda

## Cadastro do evento

Em **Atividades → Eventos**, escolha Encontro, Seminário, Simpósio ou Mostra de documentários. O tipo Simpósio corresponde ao enum `SYMPOSIUM` na API.

O controle **Interno** reutiliza `Meeting.isInternal`:

- Ativado (`true`, padrão): o evento aparece nas atividades e na agenda de seu tipo.
- Desativado (`false`): o evento é externo e fica fora dessas listagens. Sua página completa pode ser acessada por uma notícia ou item da agenda geral vinculado. Isso controla a divulgação nas listagens, sem tornar a página privada.

Os detalhes mantêm capa, data, descrição, participantes, links, fotos e comentários moderados, inclusive para simpósios e eventos externos. Notícias usam a categoria de vínculo **Evento** e permitem selecionar eventos de qualquer tipo e das duas classificações.

## Da inscrição ao registro do evento

1. Em **Comunicação → Agenda**, cadastre título, período, local e descrição.
2. Em **Destino do botão no portal**, mantenha **Link de inscrição ou site externo** e informe a URL. O link é opcional; sem destino, a agenda mostra somente as informações.
3. Após o evento, cadastre seus registros em **Atividades → Eventos**, marcando **Interno** conforme a origem.
4. Edite o mesmo item da agenda, escolha **Evento cadastrado no portal** e selecione o registro. As opções identificam o tipo e se é interno ou externo. **Atualizar eventos** recarrega a lista, inclusive após um novo cadastro em outra aba.
5. Salve. A agenda mantém os dados e substitui o link externo por **Ver evento**, que abre os detalhes no portal.

É possível voltar ao link externo ou limpar o destino. O formulário envia `null` no campo substituído. O vínculo usa o ID do evento; mudanças posteriores em seu título ou slug são refletidas ao carregar a agenda. Eventos excluídos deixam de gerar o botão de acesso.

## Rotas e validação

- Atividades de simpósios: `/atividades/simposios` e `/atividades/simposios/:id` (UUID ou slug).
- Agenda de simpósios internos: `/agenda/simposios`.
- Agenda geral: `/agenda`.
- `POST /schedule`, `PATCH /schedule/:id` e `PATCH /schedule/slug/:slug` aceitam `meetingId` opcional. Um vínculo novo precisa apontar para um evento existente e não excluído.
- `meetingId` e `externalUrl` preenchidos simultaneamente são rejeitados. Informar um deles limpa o outro; omitir ambos em um PATCH preserva o destino existente.
- As respostas da agenda incluem `meetingId` e `meeting: { id, slug, title, type, isInternal } | null`. Um evento excluído retorna `meeting: null`.

A migração `20261027180000_add_symposium_and_schedule_meeting` adiciona o enum e uma relação opcional, com índice e chave estrangeira. Os registros existentes mantêm seus dados e links.

## Bancas de progressão e conclusão de curso

O campo obrigatório **Tipo de banca** oferece **Banca de Qualificação** (validação do projeto e dos capítulos iniciais) e **Banca de Defesa** (exame final do TCC, dissertação ou tese). A explicação da opção escolhida aparece abaixo dos dados gerais.

A listagem administrativa permite filtrar por tipo, e a visualização administrativa mostra a classificação. No portal, a etiqueta aparece tanto na linha do tempo `/agenda/bancas` quanto nos detalhes `/agenda/bancas/:id`, com texto e ícone, nos temas claro e escuro.

A migration da API `20261030120000_add_board_type` mantém as bancas antigas sem classificação. Elas aparecem como **Não informado** no admin e sem etiqueta no portal. Ao editar, escolha o tipo correto; o sistema não deduz a classificação pelo título. O tipo é enviado como `QUALIFICATION` ou `DEFENSE`. A API atualizada e sua migration devem ser publicadas antes do frontend.

## Data e hora das bancas

Em **Bancas**, o campo obrigatório **Data e hora** permite cadastrar e editar o horário local do navegador. O formulário envia o instante em ISO 8601 com UTC e recupera a hora local ao editar, preservando o horário quando outros campos são alterados. A listagem e a visualização administrativa exibem data e hora.

No portal, `/agenda/bancas` e `/agenda/bancas/:id` mostram a data completa e o horário de Brasília (`America/Sao_Paulo`). A API e o campo `Board.date` já armazenam data e hora; essa alteração não exige migration.

Ao revisar bancas antigas, confira também o horário: o formulário anterior salvava somente a data, representada como meia-noite UTC, sem informar a hora real da banca. Os instantes existentes são mantidos; o sistema não consegue recuperar o horário que não foi cadastrado.

## Verificação

- Front: `yarn test:boards`, `yarn test:schedule`, `yarn test:gallery`, `yarn test:portal`, `yarn test:news`, `yarn test:navigation` e `yarn test:timeline`.
- API: `yarn test:boards` e `yarn test --runInBand --testPathPatterns='schedule/|meetings/|reports/'`.
- Integração de bancas: `BOARDS_TEST_DATABASE_URL=... yarn test:boards:integration`, em banco de teste dedicado. Aplica as migrations em um schema aleatório e remove somente esse schema ao terminar.
- Integração com PostgreSQL: `yarn test:events:integration`, após aplicar as migrações. Cria registros dentro de uma transação e sempre desfaz os dados de teste.
