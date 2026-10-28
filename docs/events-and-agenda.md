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

## Verificação

- Front: `yarn test:schedule`, `yarn test:gallery`, `yarn test:portal`, `yarn test:news`, `yarn test:navigation` e `yarn test:timeline`.
- API: `yarn test --runInBand --testPathPatterns='schedule/|meetings/|reports/'`.
- Integração com PostgreSQL: `yarn test:events:integration`, após aplicar as migrações. Cria registros dentro de uma transação e sempre desfaz os dados de teste.
