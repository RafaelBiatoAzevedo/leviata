# Instituições

O cadastro de instituições fica em **Administração → Instituições**, na rota `/admin/instituicoes`. Usa os componentes, temas, paginação, confirmação de exclusão e permissões compartilhados do painel.

Nome, sigla e país são obrigatórios. A listagem permite buscar por nome ou sigla e filtrar por país. Cada registro tem ações de visualizar e editar; superadministradores também podem excluir.

## API

Todas as rotas exigem autenticação administrativa e são documentadas no Swagger da API.

| Método   | Rota                      | Comportamento                                                                        |
| -------- | ------------------------- | ------------------------------------------------------------------------------------ |
| `POST`   | `/institutions`           | Cria com `name`, `acronym` e `countryId`                                             |
| `GET`    | `/institutions`           | Retorna o catálogo completo de instituições disponíveis para os seletores existentes |
| `GET`    | `/institutions/paginated` | Retorna `{ items, total, page, limit }` para a listagem administrativa               |
| `GET`    | `/institutions/:id`       | Consulta os dados e o país da instituição                                            |
| `PATCH`  | `/institutions/:id`       | Atualiza somente os campos enviados                                                  |
| `DELETE` | `/institutions/:id`       | Exclusão lógica por superadministrador; resposta `204`                               |

Filtros: `search`, `countryId`, `sortBy` (`name`, `acronym`, `createdAt`, `updatedAt`) e `sortOrder` (`asc`, `desc`). A paginação aceita `page` a partir de 1 e `limit` entre 1 e 100, com padrão de 10 no endpoint paginado. O catálogo completo também aceita paginação explícita, sem mudar o comportamento das chamadas existentes que omitem esses parâmetros.

O nome tem limite de 255 caracteres e a sigla, de 50. Espaços nas extremidades são removidos, preservando a grafia e as maiúsculas informadas. O país deve existir. Edições parciais não permitem limpar os campos obrigatórios com `null` ou texto vazio.

Nomes duplicados retornam `409`, inclusive quando o nome está reservado por um registro excluído. Instituições ausentes ou excluídas retornam `404`. País não cadastrado retorna `400`.

A exclusão registra `deletedAt` e `deletedById`, preservando a linha e seus vínculos. Se houver pessoas não excluídas vinculadas à instituição, a API retorna `409` e orienta a alterar os vínculos primeiro. Administradores comuns recebem `403` ao tentar excluir.

## Integração com pessoas

Após salvar ou excluir, o painel atualiza o catálogo compartilhado de instituições usado pelo formulário de pessoas. Se essa atualização falhar depois de uma gravação bem-sucedida, o painel informa que é necessário recarregar a página, sem tratar a gravação como falha nem repetir o cadastro.

O modelo `Institution` já contém os campos necessários; esta implementação não requer alteração de schema ou migração do banco.

## Verificação

No frontend:

```sh
npm run test:institutions
npm run test:admin
npm run test:people
npm run build
```

Na API:

```sh
npm run test:institutions
npm run build
```

Os testes novos usam mocks e não criam, alteram ou excluem dados do banco configurado no projeto.
