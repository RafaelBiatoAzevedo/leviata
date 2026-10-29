# Referência completa da API e do banco de dados

## 1. Convenções do contrato

O endereço base é definido na implantação; no desenvolvimento padrão, `http://localhost:3000`. O código não registra prefixo global `/api` nem versionamento de rotas. Um proxy pode acrescentar um prefixo, que precisa ser refletido em `VITE_API_BASE_URL` e nas URLs públicas do módulo de e-mail.

| Assunto | Convenção atual |
| --- | --- |
| Identificador | Normalmente UUID; slugs são alternativas em endpoints `/slug/:slug` |
| Autenticação | `Authorization: Bearer <accessToken>` |
| JSON | `Content-Type: application/json`; parser JSON com teto de 2 MB |
| Upload | `multipart/form-data`, usando o nome do campo exigido no interceptor; o cliente deve montar o boundary |
| Datas | ISO 8601; datas com hora devem informar fuso para evitar deslocamentos |
| Exclusão | Geralmente lógica; mídia e comentário recusado têm regras próprias |
| Listagem pública | Usualmente array, com `page`/`limit`; não significa coleção inteira em uma chamada |
| Listagem paginada | `{ items, total, page, limit }`; `total` corresponde ao filtro completo |
| Ordenação | `sortBy` e `sortOrder` são validados por DTO; não são colunas arbitrárias |
| Campos extras | Rejeitados pelo `ValidationPipe` quando não pertencem ao contrato validado |

As rotas declaradas com `:id` não devem receber slug apenas por conveniência. O serviço público do frontend identifica UUID com expressão regular e escolhe a variante `/slug/` quando necessário. Não existe uma camada global de serialização de respostas que garanta automaticamente que todo DTO Swagger coincide com todo retorno do repositório.

### 1.1 Acesso e status HTTP

O catálogo diferencia **público**, **JWT**, **admin/superadmin**, **superadmin** e a regra especial de PDF. `ApiBearerAuth` é metadado de documentação, não autorização. Um guard local adicional não é removido por `@Public()`.

Na ausência de `@HttpCode`, Nest/Express usa normalmente 201 para POST e 200 para os demais métodos. Decorators `ApiOkResponse`/`ApiNoContentResponse` descrevem o Swagger, mas não mudam sozinhos o status HTTP. O catálogo informa códigos declarados e sinaliza redirecionamento/download. Confirme o status efetivo ao construir consumidores, especialmente em endpoints antigos de exclusão.

Erros comuns: 400 para entrada inválida; 401 para token/credencial inválidos; 403 para permissão insuficiente; 404 para registro ausente; 409 para conflito/concorrência; 429 para limite do recurso; 503 para indisponibilidade de envio/geração. Falhas do banco e do provedor podem chegar como erro de servidor quando não têm tratamento específico.

### 1.2 Exemplos sem dados reais

Inscrever um e-mail público:

```sh
curl -X POST http://localhost:3000/newsletter/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email":"pessoa@example.com"}'
```

Consultar instrumentos públicos:

```sh
curl 'http://localhost:3000/researchInstruments?type=CATALOG&page=1&limit=20'
```

Consultar uma página administrativa, usando um token obtido no fluxo de login:

```sh
curl 'http://localhost:3000/news/paginated?page=1&limit=15' \
  -H "Authorization: Bearer ${LEVIATA_ACCESS_TOKEN}"
```

Enviar comentário para revisão:

```json
{
  "targetType": "JURY",
  "targetId": "550e8400-e29b-41d4-a716-446655440000",
  "fullName": "Pessoa de Exemplo",
  "text": "Uma contribuição breve sobre a atividade."
}
```

O UUID do exemplo deve ser substituído por um alvo realmente existente. O payload não aprova a mensagem nem oferece um campo para o visitante escolher o status.

## 2. Regras que atravessam os módulos

### 2.1 Sessão e autorização

O login verifica a conta ativa e compara a senha com bcrypt. Access e refresh tokens têm segredos e validades independentes. Os padrões são 1 dia para acesso e 7 dias para refresh, alteráveis por ambiente. O refresh persistido é um hash, não o token em texto.

`JwtStrategy` consulta o usuário ativo/não excluído e compara `tokenVersion` em cada validação. O papel devolvido ao request vem do banco atual. O logout e alterações relevantes de conta invalidam sessões anteriores. Como há um único `hashedRefreshToken` por usuário, novos logins/rotações substituem o refresh salvo para aquela conta.

O front armazena tokens e usuário em localStorage. Isso é a arquitetura atual, não autenticação por cookie HttpOnly nem MFA. O painel protegido não deve ser confundido com proteção de todos os endpoints públicos ou de todos os arquivos externos.

### 2.2 Relações e mídia

Vínculos editoriais usam IDs de pessoas/vídeos/eventos existentes. Nem toda relação polimórfica é uma chave estrangeira: `Comment.targetType/targetId` e `News.relatedType/relatedId` precisam de regras específicas da aplicação. As de comentários são verificadas pelo serviço de alvos.

Capas podem usar um public ID ligado ao slug; renomear títulos pode renomear a mídia em alguns módulos. Galerias usam UUIDs separados das capas e verificam a propriedade da imagem antes de alterá-la. A exclusão de uma imagem compartilhada preserva vínculos de outras coleções quando aplicável. O banco guarda o relacionamento; o arquivo externo só é removível de forma controlada quando existe `publicId` conhecido.

### 2.3 Filtros e paginação

O padrão de query inclui `page`, `limit`, `search`, `sortBy` e `sortOrder`, mas cada DTO lista os valores aceitos. Há filtros específicos para tipo de artigo, tipo de encontro, categoria de pessoa, nacionalidade/instituição/título, situação ativa, categoria da notícia e períodos de data. Não envie um filtro de outro recurso supondo que será ignorado.

`findPage` usa o mesmo `where` para itens e contagem. As listagens acrescentam um desempate por identificador onde implementado, evitando oscilações de página entre registros iguais no campo de ordenação. A interface pode solicitar limites diferentes do default do backend.

### 2.4 Observações específicas de contrato

* Livros, artigos, pessoas, vídeos e newsletters têm consulta individual protegida em várias rotas, apesar de sua listagem geral ser pública. O catálogo de acesso registra cada caso; “consulta de conteúdo” não implica sempre acesso anônimo.
* A listagem pública de newsletter não aplica filtro de publicação no repositório. A checagem de publicação do PDF não protege o HTML retornado por essa listagem.
* `CreateResearchInstrumentDto` declara anos com `?`, mas seus validadores inteiros não têm `IsOptional`. A ausência pode ser rejeitada pela validação HTTP, embora o formulário trate esses campos como opcionais. Trata-se de uma diferença real a revisar, não de garantia de opcionalidade.
* Datas finais de agenda são validadas também no serviço, considerando início/fim preservados numa atualização parcial.
* Os nomes das propriedades de relações variam por recurso; use o DTO correto, não a coluna bruta do schema como payload.

## 3. Catálogo de todas as operações HTTP

Foram identificadas **213 operações em 31 controllers**. Abaixo estão método, caminho, acesso, finalidade, parâmetros e respostas documentadas no código. Os 213 itens incluem o redirecionamento da raiz e não incluem rotas automaticamente registradas por Swagger (`/docs` e `/docs-json`).

“JWT” descreve o guard efetivo. Como o enum atual tem somente ADMIN e SUPER_ADMIN, esses são os perfis normais autenticados, mas a distinção entre `JwtAuthGuard` e `AdminGuard` foi mantida para permitir auditoria.

### AcademicTitlesController

Fonte: [leviata-api/src/academic-titles/academic-titles.controller.ts](<leviata-api/src/academic-titles/academic-titles.controller.ts>). 1 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /academic-titles` | JWT | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | — | `AcademicTitleResponseDto`[] | `200 (padrão)` |

### AppController

Fonte: [leviata-api/src/app.controller.ts](<leviata-api/src/app.controller.ts>). 1 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /` | Público (sem guard declarado) | Redirecionar para /docs (302).<br>`redirectToDocs` | — | Redirecionamento | `302` |

### ArticlesController

Fonte: [leviata-api/src/articles/articles.controller.ts](<leviata-api/src/articles/articles.controller.ts>). 11 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /articles` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateArticleDto`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `ArticleResponseDto` | `201 (padrão)` |
| `GET /articles` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → ArticlesQueryDto` | `ArticleResponseDto`[] | `200 (padrão)` |
| `GET /articles/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → ArticlesQueryDto` | Página de `ArticleResponseDto` | `200 (padrão)` |
| `GET /articles/:id` | JWT | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `ArticleResponseDto` | `200 (padrão)` |
| `PATCH /articles/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateArticleDto` | `ArticleResponseDto` | `200 (padrão)` |
| `DELETE /articles/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `PATCH /articles/slug/:slug/cover` | JWT | Enviar/substituir capa ou arquivo do registro.<br>`uploadCover` | `Param: slug → string`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `UploadImageResponseDto` | `200 (padrão)` |
| `DELETE /articles/slug/:slug/cover` | JWT | Remover a capa/foto/PDF associado.<br>`removeImage` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /articles/slug/:slug` | JWT | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `ArticleResponseDto` | `200 (padrão)` |
| `PATCH /articles/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateArticleDto` | `ArticleResponseDto` | `200 (padrão)` |
| `DELETE /articles/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### AuthController

Fonte: [leviata-api/src/auth/auth.controller.ts](<leviata-api/src/auth/auth.controller.ts>). 4 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /auth/login` | Público | Verificar credenciais e devolver tokens/usuário.<br>`login` | `Body: dto → LoginRequestDto` | `LoginResponseDto` | `201 (padrão)` |
| `POST /auth/logout` | JWT | Invalidar a sessão de acesso/renovação do usuário.<br>`logout` | — | Resposta do serviço; ver fonte | `HttpStatus.NO_CONTENT` |
| `POST /auth/refresh` | Público | Verificar refresh salvo e rotacionar os tokens.<br>`refresh` | `Body: dto → RefreshRequestDto` | `RefreshResponseDto` | `201 (padrão)` |
| `GET /auth/me` | JWT | Consultar a própria conta autenticada.<br>`me` | — | `MeResponseDto` | `200 (padrão)` |

### BoardsImagesController

Fonte: [leviata-api/src/boards/boards-images.controller.ts](<leviata-api/src/boards/boards-images.controller.ts>). 4 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /boards/:id/images` | Público | Listar galeria do registro disponível.<br>`listImages` | `Param: id → string` | `ImageResponseDto`[] | `200 (padrão)` |
| `POST /boards/:id/images` | JWT | Enviar imagem e metadados para a galeria.<br>`uploadImages` | `Param: id → string`<br>`UploadedFile: image → GalleryFile`<br>`Body: dto → ImageMetadataDto`<br>`@UseInterceptors( FileInterceptor('image', { limits: { fileSize: GALLERY_IMAGE_MAX_BYTES } }), )`<br>`@ApiConsumes('multipart/form-data')` | `ImageResponseDto` | `201 (padrão)` |
| `PATCH /boards/:id/images/:imageId` | JWT | Editar título/descrição da imagem que pertence ao registro.<br>`updateImages` | `Param: id → string`<br>`Param: imageId → string`<br>`Body: dto → ImageMetadataDto` | `ImageResponseDto` | `200 (padrão)` |
| `DELETE /boards/:id/images/:imageId` | JWT | Remover imagem/vínculo e arquivo externo quando aplicável.<br>`removeImages` | `Param: id → string`<br>`Param: imageId → string` | Resposta do serviço; ver fonte | `204` |

### BoardsController

Fonte: [leviata-api/src/boards/boards.controller.ts](<leviata-api/src/boards/boards.controller.ts>). 9 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /boards` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateBoardDto` | `BoardResponseDto` | `201 (padrão)` |
| `GET /boards` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → BoardsQueryDto` | `BoardResponseDto`[] | `200 (padrão)` |
| `GET /boards/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → BoardsQueryDto` | Página de `BoardResponseDto` | `200 (padrão)` |
| `GET /boards/:id` | Público | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `BoardResponseDto` | `200 (padrão)` |
| `PATCH /boards/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateBoardDto` | `BoardResponseDto` | `200 (padrão)` |
| `DELETE /boards/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /boards/slug/:slug` | Público | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `BoardResponseDto` | `200 (padrão)` |
| `PATCH /boards/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateBoardDto` | `BoardResponseDto` | `200 (padrão)` |
| `DELETE /boards/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### BooksController

Fonte: [leviata-api/src/books/books.controller.ts](<leviata-api/src/books/books.controller.ts>). 11 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /books` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateBookDto`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `BookResponseDto` | `201 (padrão)` |
| `GET /books` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → BooksQueryDto` | `BookResponseDto`[] | `200 (padrão)` |
| `GET /books/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → BooksQueryDto` | Página de `BookResponseDto` | `200 (padrão)` |
| `GET /books/:id` | JWT | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `BookResponseDto` | `200 (padrão)` |
| `PATCH /books/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateBookDto` | `BookResponseDto` | `200 (padrão)` |
| `DELETE /books/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `PATCH /books/slug/:slug/cover` | JWT | Enviar/substituir capa ou arquivo do registro.<br>`uploadCover` | `Param: slug → string`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `UploadImageResponseDto` | `200 (padrão)` |
| `DELETE /books/slug/:slug/cover` | JWT | Remover a capa/foto/PDF associado.<br>`removeImage` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /books/slug/:slug` | JWT | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `BookResponseDto` | `200 (padrão)` |
| `PATCH /books/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateBookDto` | `BookResponseDto` | `200 (padrão)` |
| `DELETE /books/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### CommentsController

Fonte: [leviata-api/src/comments/comments.controller.ts](<leviata-api/src/comments/comments.controller.ts>). 3 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /comments` | Público | Listar somente comentários aprovados do alvo disponível.<br>`findPublic` | `Query: query → PublicCommentsQueryDto` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `POST /comments` | Público + limite por IP | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateCommentDto` | Resposta do serviço; ver fonte | `201 (padrão)` |
| `PATCH /comments/:id/moderation` | SUPER_ADMIN + JWT | Aprovar pendente ou apagar definitivamente comentário recusado.<br>`moderate` | `Param: id → string`<br>`Body: dto → ModerateCommentDto` | Resposta do serviço; ver fonte | `200 (padrão)` |

### CountriesController

Fonte: [leviata-api/src/countries/countries.controller.ts](<leviata-api/src/countries/countries.controller.ts>). 1 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /countries` | JWT | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | — | `CountryResponseDto`[] | `200 (padrão)` |

### InstitutionsController

Fonte: [leviata-api/src/institutions/institutions.controller.ts](<leviata-api/src/institutions/institutions.controller.ts>). 1 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /institutions` | JWT | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | — | `InstitutionResponseDto`[] | `200 (padrão)` |

### JuriesImagesController

Fonte: [leviata-api/src/juris/juries-images.controller.ts](<leviata-api/src/juris/juries-images.controller.ts>). 4 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /juries/:id/images` | Público | Listar galeria do registro disponível.<br>`listImages` | `Param: id → string` | `ImageResponseDto`[] | `200 (padrão)` |
| `POST /juries/:id/images` | JWT | Enviar imagem e metadados para a galeria.<br>`uploadImages` | `Param: id → string`<br>`UploadedFile: image → GalleryFile`<br>`Body: dto → ImageMetadataDto`<br>`@UseInterceptors( FileInterceptor('image', { limits: { fileSize: GALLERY_IMAGE_MAX_BYTES } }), )`<br>`@ApiConsumes('multipart/form-data')` | `ImageResponseDto` | `201 (padrão)` |
| `PATCH /juries/:id/images/:imageId` | JWT | Editar título/descrição da imagem que pertence ao registro.<br>`updateImages` | `Param: id → string`<br>`Param: imageId → string`<br>`Body: dto → ImageMetadataDto` | `ImageResponseDto` | `200 (padrão)` |
| `DELETE /juries/:id/images/:imageId` | JWT | Remover imagem/vínculo e arquivo externo quando aplicável.<br>`removeImages` | `Param: id → string`<br>`Param: imageId → string` | Resposta do serviço; ver fonte | `204` |

### JuriesController

Fonte: [leviata-api/src/juris/juries.controller.ts](<leviata-api/src/juris/juries.controller.ts>). 11 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /juries` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateJuryDto`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `JuryResponseDto` | `201 (padrão)` |
| `GET /juries` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → JuriesQueryDto` | `JuryResponseDto`[] | `200 (padrão)` |
| `GET /juries/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → JuriesQueryDto` | Página de `JuryResponseDto` | `200 (padrão)` |
| `GET /juries/:id` | Público | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `JuryResponseDto` | `200 (padrão)` |
| `PATCH /juries/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateJuryDto` | `JuryResponseDto` | `200 (padrão)` |
| `DELETE /juries/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `PATCH /juries/slug/:slug/cover` | JWT | Enviar/substituir capa ou arquivo do registro.<br>`uploadCover` | `Param: slug → string`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `UploadImageResponseDto` | `200 (padrão)` |
| `DELETE /juries/slug/:slug/cover` | JWT | Remover a capa/foto/PDF associado.<br>`removeImage` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /juries/slug/:slug` | Público | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `JuryResponseDto` | `200 (padrão)` |
| `PATCH /juries/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateJuryDto` | `JuryResponseDto` | `200 (padrão)` |
| `DELETE /juries/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### MailUnsubscribeController

Fonte: [leviata-api/src/mail/mail-unsubscribe.controller.ts](<leviata-api/src/mail/mail-unsubscribe.controller.ts>). 2 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /mail/unsubscribe` | Público | Mostrar confirmação HTML de descadastro sem alterar consentimento.<br>`confirm` | `Query: dto → MailTokenDto` | text/html | `200 (padrão)` |
| `POST /mail/unsubscribe` | Público | Confirmar descadastro por token assinado; aceita one-click POST.<br>`remove` | `Query: dto → MailTokenDto` | Resposta do serviço; ver fonte | `200` |

### MailController

Fonte: [leviata-api/src/mail/mail.controller.ts](<leviata-api/src/mail/mail.controller.ts>). 10 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /mail/status` | ADMIN / SUPER_ADMIN + JWT | Consultar prontidão do e-mail e nomes de variáveis faltantes.<br>`status` | — | Resposta do serviço; ver fonte | `200 (padrão)` |
| `POST /mail/verify` | ADMIN / SUPER_ADMIN + JWT | Verificar autenticação SMTP sem enviar mensagem.<br>`verify` | — | Resposta do serviço; ver fonte | `200` |
| `POST /mail/newsletters/:id/test` | ADMIN / SUPER_ADMIN + JWT | Enviar e-mail de teste ao destinatário informado, com PDF, sem campanha.<br>`test` | `Param: id → string`<br>`Body: dto → MailTestDto` | Resposta do serviço; ver fonte | `200` |
| `POST /mail/newsletters/:id/send` | ADMIN / SUPER_ADMIN + JWT | Criar/reutilizar campanha da edição publicada para elegíveis.<br>`send` | `Param: id → string` | Resposta do serviço; ver fonte | `202` |
| `GET /mail/newsletters/:id/status` | ADMIN / SUPER_ADMIN + JWT | Consultar progresso e totais da campanha.<br>`campaignStatus` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /mail/newsletters/:id/deliveries` | ADMIN / SUPER_ADMIN + JWT | Listar destinatários/estados da fila.<br>`deliveries` | `Param: id → string`<br>`Query: query → MailDeliveriesQueryDto` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /mail/newsletters/:id/audience` | ADMIN / SUPER_ADMIN + JWT | Consultar totais elegíveis sem expor a lista de endereços.<br>`audience` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /mail/newsletters/:id/delivery-records` | ADMIN / SUPER_ADMIN + JWT | Listar histórico NewsletterDelivery, incluindo registros antigos.<br>`deliveryRecords` | `Param: id → string`<br>`Query: query → MailDeliveriesQueryDto` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `POST /mail/newsletters/:id/retry` | ADMIN / SUPER_ADMIN + JWT | Reativar somente falhas confirmadas; não repetir SENT/UNKNOWN.<br>`retry` | `Param: id → string` | Resposta do serviço; ver fonte | `202` |
| `POST /mail/newsletters/:id/cancel` | ADMIN / SUPER_ADMIN + JWT | Cancelar pendências; envios SMTP já em curso podem terminar.<br>`cancel` | `Param: id → string` | Resposta do serviço; ver fonte | `200` |

### MeetingsImagesController

Fonte: [leviata-api/src/meetings/meetings-images.controller.ts](<leviata-api/src/meetings/meetings-images.controller.ts>). 4 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /meetings/:id/images` | Público | Listar galeria do registro disponível.<br>`listImages` | `Param: id → string` | `ImageResponseDto`[] | `200 (padrão)` |
| `POST /meetings/:id/images` | JWT | Enviar imagem e metadados para a galeria.<br>`uploadImages` | `Param: id → string`<br>`UploadedFile: image → GalleryFile`<br>`Body: dto → ImageMetadataDto`<br>`@UseInterceptors( FileInterceptor('image', { limits: { fileSize: GALLERY_IMAGE_MAX_BYTES } }), )`<br>`@ApiConsumes('multipart/form-data')` | `ImageResponseDto` | `201 (padrão)` |
| `PATCH /meetings/:id/images/:imageId` | JWT | Editar título/descrição da imagem que pertence ao registro.<br>`updateImages` | `Param: id → string`<br>`Param: imageId → string`<br>`Body: dto → ImageMetadataDto` | `ImageResponseDto` | `200 (padrão)` |
| `DELETE /meetings/:id/images/:imageId` | JWT | Remover imagem/vínculo e arquivo externo quando aplicável.<br>`removeImages` | `Param: id → string`<br>`Param: imageId → string` | Resposta do serviço; ver fonte | `204` |

### MeetingsController

Fonte: [leviata-api/src/meetings/meetings.controller.ts](<leviata-api/src/meetings/meetings.controller.ts>). 11 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /meetings` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateMeetingDto`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `MeetingResponseDto` | `201 (padrão)` |
| `GET /meetings` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → MeetingsQueryDto` | `MeetingResponseDto`[] | `200 (padrão)` |
| `GET /meetings/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → MeetingsQueryDto` | Página de `MeetingResponseDto` | `200 (padrão)` |
| `GET /meetings/:id` | Público | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `MeetingResponseDto` | `200 (padrão)` |
| `PATCH /meetings/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateMeetingDto` | `MeetingResponseDto` | `200 (padrão)` |
| `DELETE /meetings/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `PATCH /meetings/slug/:slug/cover` | JWT | Enviar/substituir capa ou arquivo do registro.<br>`uploadCover` | `Param: slug → string`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `UploadImageResponseDto` | `200 (padrão)` |
| `DELETE /meetings/slug/:slug/cover` | JWT | Remover a capa/foto/PDF associado.<br>`removeImage` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /meetings/slug/:slug` | Público | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `MeetingResponseDto` | `200 (padrão)` |
| `PATCH /meetings/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateMeetingDto` | `MeetingResponseDto` | `200 (padrão)` |
| `DELETE /meetings/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### NewsImagesController

Fonte: [leviata-api/src/news/news-images.controller.ts](<leviata-api/src/news/news-images.controller.ts>). 4 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /news/:id/images` | Público | Listar galeria do registro disponível.<br>`listImages` | `Param: id → string` | `ImageResponseDto`[] | `200 (padrão)` |
| `POST /news/:id/images` | JWT | Enviar imagem e metadados para a galeria.<br>`uploadImages` | `Param: id → string`<br>`UploadedFile: image → GalleryFile`<br>`Body: dto → ImageMetadataDto`<br>`@UseInterceptors( FileInterceptor('image', { limits: { fileSize: GALLERY_IMAGE_MAX_BYTES } }), )`<br>`@ApiConsumes('multipart/form-data')` | `ImageResponseDto` | `201 (padrão)` |
| `PATCH /news/:id/images/:imageId` | JWT | Editar título/descrição da imagem que pertence ao registro.<br>`updateImages` | `Param: id → string`<br>`Param: imageId → string`<br>`Body: dto → ImageMetadataDto` | `ImageResponseDto` | `200 (padrão)` |
| `DELETE /news/:id/images/:imageId` | JWT | Remover imagem/vínculo e arquivo externo quando aplicável.<br>`removeImages` | `Param: id → string`<br>`Param: imageId → string` | Resposta do serviço; ver fonte | `204` |

### NewsController

Fonte: [leviata-api/src/news/news.controller.ts](<leviata-api/src/news/news.controller.ts>). 11 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /news` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateNewsDto`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `NewsResponseDto` | `201 (padrão)` |
| `GET /news` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → NewsQueryDto` | `NewsResponseDto`[] | `200 (padrão)` |
| `GET /news/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → NewsQueryDto` | Página de `NewsResponseDto` | `200 (padrão)` |
| `GET /news/:id` | Público | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `NewsResponseDto` | `200 (padrão)` |
| `PATCH /news/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateNewsDto` | `NewsResponseDto` | `200 (padrão)` |
| `DELETE /news/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `PATCH /news/slug/:slug/cover` | JWT | Enviar/substituir capa ou arquivo do registro.<br>`uploadCover` | `Param: slug → string`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `UploadImageResponseDto` | `200 (padrão)` |
| `DELETE /news/slug/:slug/cover` | JWT | Remover a capa/foto/PDF associado.<br>`removeImage` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /news/slug/:slug` | Público | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `NewsResponseDto` | `200 (padrão)` |
| `PATCH /news/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateNewsDto` | `NewsResponseDto` | `200 (padrão)` |
| `DELETE /news/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### NewsletterController

Fonte: [leviata-api/src/newsletter/newsletter.controller.ts](<leviata-api/src/newsletter/newsletter.controller.ts>). 14 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /newsletter/:id/pdf` | Público se publicado; admin/superadmin se rascunho | Baixar PDF gerado; publicação/sessão verificadas pelo serviço.<br>`downloadPdf` | `Param: id → string` | application/pdf; Content-Disposition: attachment | `200 (padrão)` |
| `POST /newsletter/preview` | JWT | Renderizar prévia HTML sem persistir nem enviar.<br>`preview` | `Body: dto → NewsletterPreviewDto` | Resposta do serviço; ver fonte | `HttpStatus.OK` |
| `POST /newsletter/images` | JWT | Enviar JPEG/PNG/WebP para uso no conteúdo da newsletter.<br>`uploadContentImage` | `UploadedFile: file → Express.Multer.File`<br>`@UseInterceptors( FileInterceptor('image', { limits: { fileSize: 10 * 1024 * 1024 } }), )`<br>`@ApiConsumes('multipart/form-data')` | `UploadImageResponseDto` | `201 (padrão)` |
| `POST /newsletter/subscribe` | Público | Cadastrar/reativar inscrição pública por e-mail.<br>`subscribe` | `Body: dto → SubscribeNewsletterDto` | `NewsletterSubscriptionResponseDto` | `HttpStatus.OK` |
| `POST /newsletter` | JWT | Criar edição e gerar HTML/PDF antes de persistir; não inicia campanha.<br>`create` | `Body: dto → CreateNewsletterDto`<br>`UploadedFile: cover → Express.Multer.File`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data', 'application/json')` | `NewsletterResponseDto` | `201 (padrão)` |
| `PATCH /newsletter/slug/:slug/cover` | JWT | Enviar/substituir capa e regenerar documento se necessário.<br>`updateCover` | `Param: slug → string`<br>`UploadedFile: cover → Express.Multer.File`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `UploadImageResponseDto` | `200 (padrão)` |
| `GET /newsletter` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → NewsletterQueryDto` | `NewsletterResponseDto`[] | `200 (padrão)` |
| `GET /newsletter/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → NewsletterQueryDto` | Página de `NewsletterResponseDto` | `200 (padrão)` |
| `GET /newsletter/:id` | JWT | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `NewsletterResponseDto` | `200 (padrão)` |
| `PATCH /newsletter/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateNewsletterDto` | `NewsletterResponseDto` | `200 (padrão)` |
| `DELETE /newsletter/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /newsletter/slug/:slug` | JWT | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `NewsletterResponseDto` | `200 (padrão)` |
| `PATCH /newsletter/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateNewsletterDto` | `NewsletterResponseDto` | `200 (padrão)` |
| `DELETE /newsletter/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### NotificationsController

Fonte: [leviata-api/src/notifications/notifications.controller.ts](<leviata-api/src/notifications/notifications.controller.ts>). 6 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /notifications/counts` | ADMIN / SUPER_ADMIN + JWT | Consultar contadores de não lidas e pendências.<br>`counts` | — | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /notifications` | ADMIN / SUPER_ADMIN + JWT | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → NotificationsQueryDto` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `POST /notifications` | ADMIN / SUPER_ADMIN + JWT | Criar aviso INFO ou lembrete REMINDER, opcionalmente agendado.<br>`create` | `Body: dto → CreateNotificationDto` | Resposta do serviço; ver fonte | `201 (padrão)` |
| `PATCH /notifications/read-all` | ADMIN / SUPER_ADMIN + JWT | Marcar notificações já visíveis como lidas, individualmente.<br>`markAllRead` | — | Resposta do serviço; ver fonte | `200 (padrão)` |
| `PATCH /notifications/:id/read` | ADMIN / SUPER_ADMIN + JWT | Marcar uma notificação visível como lida para o usuário.<br>`markRead` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /notifications/:id` | ADMIN / SUPER_ADMIN + JWT | Consultar detalhes pelo identificador.<br>`findOne` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### PeopleController

Fonte: [leviata-api/src/people/people.controller.ts](<leviata-api/src/people/people.controller.ts>). 11 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /people` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreatePersonDto`<br>`UploadedFile: image → any`<br>`@UseInterceptors(FileInterceptor('image'))`<br>`@ApiConsumes('multipart/form-data')` | `PersonResponseDto` | `201 (padrão)` |
| `GET /people` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → PeopleQueryDto` | `PersonResponseDto`[] | `200 (padrão)` |
| `GET /people/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → PeopleQueryDto` | Página de `PersonResponseDto` | `200 (padrão)` |
| `GET /people/:id` | JWT | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `PersonResponseDto` | `200 (padrão)` |
| `PATCH /people/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdatePersonDto` | `PersonResponseDto` | `200 (padrão)` |
| `DELETE /people/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `PATCH /people/slug/:slug/image` | JWT | Enviar/substituir foto de perfil.<br>`uploadImage` | `Param: slug → string`<br>`UploadedFile: image → any`<br>`@UseInterceptors(FileInterceptor('image'))`<br>`@ApiConsumes('multipart/form-data')` | `UploadImageResponseDto` | `200 (padrão)` |
| `DELETE /people/slug/:slug/image` | JWT | Remover a capa/foto/PDF associado.<br>`removeImage` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /people/slug/:slug` | JWT | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `PersonResponseDto` | `200 (padrão)` |
| `PATCH /people/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdatePersonDto` | `PersonResponseDto` | `200 (padrão)` |
| `DELETE /people/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### PresentedWorksImagesController

Fonte: [leviata-api/src/presentedWorks/presented-works-images.controller.ts](<leviata-api/src/presentedWorks/presented-works-images.controller.ts>). 4 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /presented-works/:id/images` | Público | Listar galeria do registro disponível.<br>`listImages` | `Param: id → string` | `ImageResponseDto`[] | `200 (padrão)` |
| `POST /presented-works/:id/images` | JWT | Enviar imagem e metadados para a galeria.<br>`uploadImages` | `Param: id → string`<br>`UploadedFile: image → GalleryFile`<br>`Body: dto → ImageMetadataDto`<br>`@UseInterceptors( FileInterceptor('image', { limits: { fileSize: GALLERY_IMAGE_MAX_BYTES } }), )`<br>`@ApiConsumes('multipart/form-data')` | `ImageResponseDto` | `201 (padrão)` |
| `PATCH /presented-works/:id/images/:imageId` | JWT | Editar título/descrição da imagem que pertence ao registro.<br>`updateImages` | `Param: id → string`<br>`Param: imageId → string`<br>`Body: dto → ImageMetadataDto` | `ImageResponseDto` | `200 (padrão)` |
| `DELETE /presented-works/:id/images/:imageId` | JWT | Remover imagem/vínculo e arquivo externo quando aplicável.<br>`removeImages` | `Param: id → string`<br>`Param: imageId → string` | Resposta do serviço; ver fonte | `204` |

### PresentedWorksController

Fonte: [leviata-api/src/presentedWorks/presented-works.controller.ts](<leviata-api/src/presentedWorks/presented-works.controller.ts>). 9 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /presented-works` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreatePresentedWorkDto` | `PresentedWorkResponseDto` | `201 (padrão)` |
| `GET /presented-works` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → PresentedWorksQueryDto` | `PresentedWorkResponseDto`[] | `200 (padrão)` |
| `GET /presented-works/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → PresentedWorksQueryDto` | Página de `PresentedWorkResponseDto` | `200 (padrão)` |
| `GET /presented-works/:id` | Público | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `PresentedWorkResponseDto` | `200 (padrão)` |
| `PATCH /presented-works/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdatePresentedWorkDto` | `PresentedWorkResponseDto` | `200 (padrão)` |
| `DELETE /presented-works/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /presented-works/slug/:slug` | Público | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `PresentedWorkResponseDto` | `200 (padrão)` |
| `PATCH /presented-works/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdatePresentedWorkDto` | `PresentedWorkResponseDto` | `200 (padrão)` |
| `DELETE /presented-works/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### ReportsController

Fonte: [leviata-api/src/reports/reports.controller.ts](<leviata-api/src/reports/reports.controller.ts>). 1 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /reports/summary` | JWT | Consultar seis contadores editoriais e data de geração.<br>`getSummary` | — | `SummaryReportResponseDto` | `200 (padrão)` |

### ResearchImagesController

Fonte: [leviata-api/src/research/researchs-images.controller.ts](<leviata-api/src/research/researchs-images.controller.ts>). 8 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /research/:id/images` | Público | Listar galeria do registro disponível.<br>`listImages` | `Param: id → string` | `ImageResponseDto`[] | `200 (padrão)` |
| `POST /research/:id/images` | JWT | Enviar imagem e metadados para a galeria.<br>`uploadImages` | `Param: id → string`<br>`UploadedFile: image → GalleryFile`<br>`Body: dto → ImageMetadataDto`<br>`@UseInterceptors( FileInterceptor('image', { limits: { fileSize: GALLERY_IMAGE_MAX_BYTES } }), )`<br>`@ApiConsumes('multipart/form-data')` | `ImageResponseDto` | `201 (padrão)` |
| `PATCH /research/:id/images/:imageId` | JWT | Editar título/descrição da imagem que pertence ao registro.<br>`updateImages` | `Param: id → string`<br>`Param: imageId → string`<br>`Body: dto → ImageMetadataDto` | `ImageResponseDto` | `200 (padrão)` |
| `DELETE /research/:id/images/:imageId` | JWT | Remover imagem/vínculo e arquivo externo quando aplicável.<br>`removeImages` | `Param: id → string`<br>`Param: imageId → string` | Resposta do serviço; ver fonte | `204` |
| `GET /research/:id/supports` | Público | Listar imagens de apoiadores da pesquisa.<br>`listSupports` | `Param: id → string` | `ImageResponseDto`[] | `200 (padrão)` |
| `POST /research/:id/supports` | JWT | Enviar imagem de apoiador.<br>`uploadSupports` | `Param: id → string`<br>`UploadedFile: image → GalleryFile`<br>`Body: dto → ImageMetadataDto`<br>`@UseInterceptors( FileInterceptor('image', { limits: { fileSize: GALLERY_IMAGE_MAX_BYTES } }), )`<br>`@ApiConsumes('multipart/form-data')` | `ImageResponseDto` | `201 (padrão)` |
| `PATCH /research/:id/supports/:imageId` | JWT | Editar legenda do apoiador.<br>`updateSupports` | `Param: id → string`<br>`Param: imageId → string`<br>`Body: dto → ImageMetadataDto` | `ImageResponseDto` | `200 (padrão)` |
| `DELETE /research/:id/supports/:imageId` | JWT | Remover vínculo/imagem de apoiador.<br>`removeSupports` | `Param: id → string`<br>`Param: imageId → string` | Resposta do serviço; ver fonte | `204` |

### ResearchController

Fonte: [leviata-api/src/research/researchs.controller.ts](<leviata-api/src/research/researchs.controller.ts>). 11 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /research` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateSearchDto`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `SearchResponseDto` | `201 (padrão)` |
| `GET /research` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → ResearchQueryDto` | `SearchResponseDto`[] | `200 (padrão)` |
| `GET /research/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → ResearchQueryDto` | Página de `SearchResponseDto` | `200 (padrão)` |
| `GET /research/:id` | Público | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `SearchResponseDto` | `200 (padrão)` |
| `PATCH /research/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateSearchDto` | `SearchResponseDto` | `200 (padrão)` |
| `DELETE /research/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `PATCH /research/slug/:slug/cover` | JWT | Enviar/substituir capa ou arquivo do registro.<br>`uploadCover` | `Param: slug → string`<br>`UploadedFile: cover → any`<br>`@UseInterceptors(FileInterceptor('cover'))`<br>`@ApiConsumes('multipart/form-data')` | `UploadImageResponseDto` | `200 (padrão)` |
| `DELETE /research/slug/:slug/cover` | JWT | Remover a capa/foto/PDF associado.<br>`removeImage` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /research/slug/:slug` | Público | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `SearchResponseDto` | `200 (padrão)` |
| `PATCH /research/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateSearchDto` | `SearchResponseDto` | `200 (padrão)` |
| `DELETE /research/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### ResearchInstrumentsController

Fonte: [leviata-api/src/researchInstruments/researchInstruments.controller.ts](<leviata-api/src/researchInstruments/researchInstruments.controller.ts>). 11 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /researchInstruments` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateResearchInstrumentDto`<br>`UploadedFile: pdf → any`<br>`@UseInterceptors(FileInterceptor('pdf'))`<br>`@ApiConsumes('multipart/form-data')` | `ResearchInstrumentResponseDto` | `201 (padrão)` |
| `GET /researchInstruments` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → ResearchInstrumentsQueryDto` | `ResearchInstrumentResponseDto`[] | `200 (padrão)` |
| `GET /researchInstruments/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → ResearchInstrumentsQueryDto` | Página de `ResearchInstrumentResponseDto` | `200 (padrão)` |
| `GET /researchInstruments/:id` | Público | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `ResearchInstrumentResponseDto` | `200 (padrão)` |
| `PATCH /researchInstruments/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateResearchInstrumentDto` | `ResearchInstrumentResponseDto` | `200 (padrão)` |
| `DELETE /researchInstruments/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /researchInstruments/slug/:slug` | Público | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `ResearchInstrumentResponseDto` | `200 (padrão)` |
| `PATCH /researchInstruments/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateResearchInstrumentDto` | `ResearchInstrumentResponseDto` | `200 (padrão)` |
| `DELETE /researchInstruments/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `PATCH /researchInstruments/slug/:slug/pdf` | JWT | Enviar/substituir capa ou arquivo do registro.<br>`uploadCover` | `Param: slug → string`<br>`UploadedFile: pdf → any`<br>`@UseInterceptors(FileInterceptor('pdf'))`<br>`@ApiConsumes('multipart/form-data')` | `UploadImageResponseDto` | `200 (padrão)` |
| `DELETE /researchInstruments/slug/:slug/pdf` | JWT | Remover a capa/foto/PDF associado.<br>`removeImage` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### ScheduleController

Fonte: [leviata-api/src/schedule/schedule.controller.ts](<leviata-api/src/schedule/schedule.controller.ts>). 9 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /schedule` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateScheduleDto` | `ScheduleResponseDto` | `201 (padrão)` |
| `GET /schedule` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → ScheduleQueryDto` | `ScheduleResponseDto`[] | `200 (padrão)` |
| `GET /schedule/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → ScheduleQueryDto` | Página de `ScheduleResponseDto` | `200 (padrão)` |
| `GET /schedule/slug/:slug` | JWT | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `ScheduleResponseDto` | `200 (padrão)` |
| `PATCH /schedule/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateScheduleDto` | `ScheduleResponseDto` | `200 (padrão)` |
| `DELETE /schedule/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `HttpStatus.NO_CONTENT` |
| `GET /schedule/:id` | JWT | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `ScheduleResponseDto` | `200 (padrão)` |
| `PATCH /schedule/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateScheduleDto` | `ScheduleResponseDto` | `200 (padrão)` |
| `DELETE /schedule/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `HttpStatus.NO_CONTENT` |

### ThematicsController

Fonte: [leviata-api/src/thematics/thematics.controller.ts](<leviata-api/src/thematics/thematics.controller.ts>). 9 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /thematics` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateThematicDto` | `ThematicResponseDto` | `201 (padrão)` |
| `GET /thematics` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → ThematicsQueryDto` | `ThematicResponseDto`[] | `200 (padrão)` |
| `GET /thematics/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → ThematicsQueryDto` | Página de `ThematicResponseDto` | `200 (padrão)` |
| `GET /thematics/:id` | Público | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `ThematicResponseDto` | `200 (padrão)` |
| `PATCH /thematics/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateThematicDto` | `ThematicResponseDto` | `200 (padrão)` |
| `DELETE /thematics/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /thematics/slug/:slug` | Público | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `ThematicResponseDto` | `200 (padrão)` |
| `PATCH /thematics/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateThematicDto` | `ThematicResponseDto` | `200 (padrão)` |
| `DELETE /thematics/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |

### UsersController

Fonte: [leviata-api/src/users/users.controller.ts](<leviata-api/src/users/users.controller.ts>). 8 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `GET /users/me` | JWT | Consultar a própria conta autenticada.<br>`me` | — | `UserResponseDto` | `200 (padrão)` |
| `PATCH /users/me` | JWT | Editar a própria conta; credenciais exigem senha atual.<br>`updateAccount` | `Body: dto → UpdateAccountDto` | `UserResponseDto` | `200 (padrão)` |
| `POST /users` | SUPER_ADMIN + JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateUserDto` | `UserResponseDto` | `201 (padrão)` |
| `GET /users` | SUPER_ADMIN + JWT | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → UsersQueryDto` | `UserResponseDto`[] | `200 (padrão)` |
| `GET /users/paginated` | SUPER_ADMIN + JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → UsersQueryDto` | Página de `UserResponseDto` | `200 (padrão)` |
| `GET /users/:id` | SUPER_ADMIN + JWT | Consultar detalhes pelo identificador.<br>`findOne` | `Param: id → string` | `UserResponseDto` | `200 (padrão)` |
| `PATCH /users/:id` | SUPER_ADMIN + JWT | Atualizar campos enviados; os demais são preservados conforme o serviço.<br>`update` | `Param: id → string`<br>`Body: dto → UpdateUserDto` | `UserResponseDto` | `200 (padrão)` |
| `DELETE /users/:id` | SUPER_ADMIN + JWT | Excluir/desativar segundo as regras do módulo.<br>`remove` | `Param: id → string` | Resposta do serviço; ver fonte | `HttpStatus.NO_CONTENT` |

### VideosController

Fonte: [leviata-api/src/videos/videos.controller.ts](<leviata-api/src/videos/videos.controller.ts>). 9 operação(ões).

| Operação | Acesso efetivo | Finalidade / handler | Entradas e transporte | Saída documentada | Código declarado/padrão |
| --- | --- | --- | --- | --- | --- |
| `POST /videos` | JWT | Criar registro com o contrato informado.<br>`create` | `Body: dto → CreateVideoDto` | `VideoResponseDto` | `201 (padrão)` |
| `GET /videos` | Público | Listar registros; filtros/limites conforme o DTO.<br>`findAll` | `Query: query → VideosQueryDto` | `VideoResponseDto`[] | `200 (padrão)` |
| `GET /videos/paginated` | JWT | Listar página administrativa e total filtrado.<br>`findPage` | `Query: query → VideosQueryDto` | Página de `VideoResponseDto` | `200 (padrão)` |
| `GET /videos/:id` | JWT | Consultar registro pelo UUID.<br>`findOneById` | `Param: id → string` | `VideoResponseDto` | `200 (padrão)` |
| `PATCH /videos/:id` | JWT | Atualizar registro pelo UUID.<br>`updateById` | `Param: id → string`<br>`Body: dto → UpdateVideoDto` | `VideoResponseDto` | `200 (padrão)` |
| `DELETE /videos/:id` | JWT | Excluir logicamente registro pelo UUID.<br>`removeById` | `Param: id → string` | Resposta do serviço; ver fonte | `200 (padrão)` |
| `GET /videos/slug/:slug` | JWT | Consultar registro pelo slug.<br>`findOneBySlug` | `Param: slug → string` | `VideoResponseDto` | `200 (padrão)` |
| `PATCH /videos/slug/:slug` | JWT | Atualizar registro pelo slug.<br>`updateBySlug` | `Param: slug → string`<br>`Body: dto → UpdateVideoDto` | `VideoResponseDto` | `200 (padrão)` |
| `DELETE /videos/slug/:slug` | JWT | Excluir logicamente registro pelo slug.<br>`removeBySlug` | `Param: slug → string` | Resposta do serviço; ver fonte | `200 (padrão)` |


## 4. Contratos completos de entrada, query e resposta

O inventário identificou **102 classes de DTO**. Cada contrato abaixo apresenta seus campos próprios, tipo, indicação TypeScript de opcionalidade, valor inicial quando existente e validadores. Herança via `PartialType`/`OmitType` é registrada no início do contrato; os campos herdados estão no DTO de origem.

`PartialType` torna opcionais os campos herdados; `OmitType` os retira conforme sua expressão. `ValidateIf` aplica validação condicional. `IsOptional` normalmente dispensa a validação para ausência/null, enquanto uma propriedade TypeScript `?` não faz isso por si só. Transformações complexas são indicadas e seu texto integral permanece no inventário JSON e no arquivo-fonte vinculado. DTOs de resposta podem conter apenas metadados Swagger, sem validadores de entrada.

### AcademicTitleResponseDto

Fonte: [leviata-api/src/academic-titles/dto/academic-title-response.dto.ts](<leviata-api/src/academic-titles/dto/academic-title-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `name` | `string` | Não | Sem validação de entrada declarada neste campo |
| `abbreviation` | `string` | Não | Sem validação de entrada declarada neste campo |

### ArticlesQueryDto

Fonte: [leviata-api/src/articles/DTOs/article-query.dto.ts](<leviata-api/src/articles/DTOs/article-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `type` | `ArticleType` | Sim | `@IsOptional()`<br>`@IsEnum(ArticleType)` |
| `authorId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `year` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(0)` |
| `sortBy` | `'title' \| 'year' \| 'journal' \| 'volume' \| 'createdAt'` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@IsIn(['title', 'year', 'journal', 'volume', 'createdAt'])` |
| `sortOrder` | `'asc' \| 'desc'` | Sim | `@IsOptional()`<br>`@IsIn(['asc', 'desc'])` |

### ArticleResponseDto

Fonte: [leviata-api/src/articles/DTOs/article-response.dto.ts](<leviata-api/src/articles/DTOs/article-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `cover` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `type` | `ArticleType` | Não | Sem validação de entrada declarada neste campo |
| `journal` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `volume` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `year` | `number \| null` | Não | Sem validação de entrada declarada neste campo |
| `doi` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `summary` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `externalUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `authors` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### CreateArticleWithImageDto

Fonte: [leviata-api/src/articles/DTOs/create-article-with-cover.dto.ts](<leviata-api/src/articles/DTOs/create-article-with-cover.dto.ts>).

Herança: `extends CreateArticleDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `cover` | `any` | Sim | Sem validação de entrada declarada neste campo |

### CreateArticleDto

Fonte: [leviata-api/src/articles/DTOs/create-article.dto.ts](<leviata-api/src/articles/DTOs/create-article.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `type` | `ArticleType` | Sim | `@IsOptional()`<br>`@IsEnum(ArticleType)` |
| `journal` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(255)` |
| `volume` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(50)` |
| `year` | `number` | Sim | `Transform(…)`<br>`@IsInt()`<br>`@Min(0)` |
| `doi` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(255)` |
| `summary` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `externalUrl` | `string` | Não | `@IsUrl()` |
| `authors` | `string[]` | Não | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |

### UpdateArticleDto

Fonte: [leviata-api/src/articles/DTOs/update.article.dto.ts](<leviata-api/src/articles/DTOs/update.article.dto.ts>).

Herança: `extends PartialType(CreateArticleDto)`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `coverUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |

### LoginRequestDto

Fonte: [leviata-api/src/auth/dto/login.request.dto.ts](<leviata-api/src/auth/dto/login.request.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `email` | `string` | Não | `@IsEmail()` |
| `password` | `string` | Não | `@IsString()` |

### LoginUserResponseDto

Fonte: [leviata-api/src/auth/dto/login.response.dto.ts](<leviata-api/src/auth/dto/login.response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `email` | `string` | Não | Sem validação de entrada declarada neste campo |
| `firstName` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `lastName` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `role` | `string` | Não | Sem validação de entrada declarada neste campo |

### LoginResponseDto

Fonte: [leviata-api/src/auth/dto/login.response.dto.ts](<leviata-api/src/auth/dto/login.response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `accessToken` | `string` | Não | Sem validação de entrada declarada neste campo |
| `refreshToken` | `string` | Não | Sem validação de entrada declarada neste campo |
| `tokenType` | `string` | Não | Sem validação de entrada declarada neste campo |
| `user` | `LoginUserResponseDto` | Não | Sem validação de entrada declarada neste campo |

### MeResponseDto

Fonte: [leviata-api/src/auth/dto/me.response.dto.ts](<leviata-api/src/auth/dto/me.response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `email` | `string` | Não | Sem validação de entrada declarada neste campo |
| `role` | `string` | Não | Sem validação de entrada declarada neste campo |
| `firstName` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `lastName` | `string \| null` | Não | Sem validação de entrada declarada neste campo |

### RefreshRequestDto

Fonte: [leviata-api/src/auth/dto/refresh.request.dto.ts](<leviata-api/src/auth/dto/refresh.request.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `refreshToken` | `string` | Não | `@IsString()`<br>`@IsJWT()` |

### RefreshResponseDto

Fonte: [leviata-api/src/auth/dto/refresh.response.dto.ts](<leviata-api/src/auth/dto/refresh.response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `accessToken` | `string` | Não | Sem validação de entrada declarada neste campo |
| `refreshToken` | `string` | Não | Sem validação de entrada declarada neste campo |
| `tokenType` | `string` | Não | Sem validação de entrada declarada neste campo |

### BoardsQueryDto

Fonte: [leviata-api/src/boards/DTOs/board-query.dto.ts](<leviata-api/src/boards/DTOs/board-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `candidateId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID('4')` |
| `advisorId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID('4')` |
| `dateFrom` | `string` | Sim | `@IsOptional()`<br>`@IsDateString()` |
| `dateTo` | `string` | Sim | `@IsOptional()`<br>`@IsDateString()` |

### BoardResponseDto

Fonte: [leviata-api/src/boards/DTOs/board-response.dto.ts](<leviata-api/src/boards/DTOs/board-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `candidateId` | `string` | Não | Sem validação de entrada declarada neste campo |
| `candidate` | `PersonResponseDto` | Não | Sem validação de entrada declarada neste campo |
| `advisorId` | `string` | Não | Sem validação de entrada declarada neste campo |
| `advisor` | `PersonResponseDto` | Não | Sem validação de entrada declarada neste campo |
| `date` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `meetingUrl` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `members` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `images` | `ImageResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### CreateBoardDto

Fonte: [leviata-api/src/boards/DTOs/create-board.dto.ts](<leviata-api/src/boards/DTOs/create-board.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `candidateId` | `string` | Não | `@IsUUID()` |
| `advisorId` | `string` | Não | `@IsUUID()` |
| `members` | `string[]` | Não | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |
| `date` | `Date` | Não | `@IsNotEmpty()`<br>`@IsDate()`<br>`Transform(…)` |
| `meetingUrl` | `string` | Não | `@IsUrl()` |

### UpdateBoardDto

Fonte: [leviata-api/src/boards/DTOs/update-board.dto.ts](<leviata-api/src/boards/DTOs/update-board.dto.ts>).

Herança: `extends PartialType(CreateBoardDto)`.

Sem campos próprios: consultar o contrato herdado.

### BooksQueryDto

Fonte: [leviata-api/src/books/DTOs/book-query.dto.ts](<leviata-api/src/books/DTOs/book-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `` | Não / inicial: `1` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `` | Não / inicial: `10` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `authorId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `publisher` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `year` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()` |
| `sortBy` | `'title' \| 'year' \| 'createdAt' \| 'updatedAt'` | Não / inicial: `'title'` | `@IsOptional()`<br>`@IsIn(['title', 'year', 'createdAt', 'updatedAt'])` |
| `sortOrder` | `'asc' \| 'desc'` | Não / inicial: `'asc'` | `@IsOptional()`<br>`Transform(…)`<br>`@IsIn(['asc', 'desc'])` |

### BookResponseDto

Fonte: [leviata-api/src/books/DTOs/book-response.dto.ts](<leviata-api/src/books/DTOs/book-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `subtitle` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `coverUrl` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `description` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `isbn` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `year` | `number` | Sim | Sem validação de entrada declarada neste campo |
| `publisher` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `externalUrl` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `authors` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### CreateBookWithCoverDto

Fonte: [leviata-api/src/books/DTOs/create-book-with-cover.dto.ts](<leviata-api/src/books/DTOs/create-book-with-cover.dto.ts>).

Herança: `extends CreateBookDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `cover` | `any` | Sim | Sem validação de entrada declarada neste campo |

### CreateBookDto

Fonte: [leviata-api/src/books/DTOs/create-book.dto.ts](<leviata-api/src/books/DTOs/create-book.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `subtitle` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(255)` |
| `description` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `isbn` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(20)` |
| `year` | `number` | Não | `Transform(…)`<br>`@IsInt()`<br>`@Min(0)` |
| `publisher` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `externalUrl` | `string` | Não | `@IsUrl()` |
| `authors` | `string[]` | Não | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |

### UpdateBookDto

Fonte: [leviata-api/src/books/DTOs/update.book.dto.ts](<leviata-api/src/books/DTOs/update.book.dto.ts>).

Herança: `extends PartialType(CreateBookDto)`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `coverUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |

### CommentTargetDto

Fonte: [leviata-api/src/comments/comments.dto.ts](<leviata-api/src/comments/comments.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `targetType` | `CommentTarget` | Não | `@IsEnum(CommentTarget)` |
| `targetId` | `string` | Não | `@IsUUID()` |

### PublicCommentsQueryDto

Fonte: [leviata-api/src/comments/comments.dto.ts](<leviata-api/src/comments/comments.dto.ts>).

Herança: `extends CommentTargetDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Não / inicial: `1` | `@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100000)` |
| `limit` | `number` | Não / inicial: `30` | `@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(60)` |

### CreateCommentDto

Fonte: [leviata-api/src/comments/comments.dto.ts](<leviata-api/src/comments/comments.dto.ts>).

Herança: `extends CommentTargetDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `fullName` | `string` | Não | `Transform(…)`<br>`@IsString()`<br>`@Length(3, 120, { message: 'O nome deve ter entre 3 e 120 caracteres.' })`<br>`@Matches(/^\S+\s+\S+/, { message: 'Informe seu nome completo.' })` |
| `text` | `string` | Não | `Transform(…)`<br>`@IsString()`<br>`@Length(3, 300, { message: 'O comentário deve ter entre 3 e 300 caracteres.', })` |

### ModerateCommentDto

Fonte: [leviata-api/src/comments/comments.dto.ts](<leviata-api/src/comments/comments.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `decision` | `'approve' \| 'reject'` | Não | `@IsEnum({ approve: 'approve', reject: 'reject' })` |

### CountryResponseDto

Fonte: [leviata-api/src/countries/dto/country-response.dto.ts](<leviata-api/src/countries/dto/country-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `code` | `string` | Não | Sem validação de entrada declarada neste campo |
| `name` | `string` | Não | Sem validação de entrada declarada neste campo |

### CreateGalleryImageDto

Fonte: [leviata-api/src/images/DTOs/create-gallery-image.dto.ts](<leviata-api/src/images/DTOs/create-gallery-image.dto.ts>).

Herança: `extends ImageMetadataDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `image` | `GalleryFile` | Não | Sem validação de entrada declarada neste campo |

### ImageMetadataDto

Fonte: [leviata-api/src/images/DTOs/image-metadata.dto.ts](<leviata-api/src/images/DTOs/image-metadata.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string \| null` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(255)` |
| `description` | `string \| null` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(5000)` |

### ImageResponseDto

Fonte: [leviata-api/src/images/DTOs/image-response.dto.ts](<leviata-api/src/images/DTOs/image-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `imageUrl` | `string` | Não | Sem validação de entrada declarada neste campo |
| `publicId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `description` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `boardId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `juryId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `meetingId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `presentedWorkId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `newsId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### UploadImageResponseDto

Fonte: [leviata-api/src/images/DTOs/upload-image-response.dto.ts](<leviata-api/src/images/DTOs/upload-image-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `publicId` | `string` | Não | Sem validação de entrada declarada neste campo |
| `url` | `string` | Não | Sem validação de entrada declarada neste campo |

### InstitutionResponseDto

Fonte: [leviata-api/src/institutions/dto/institution-response.dto.ts](<leviata-api/src/institutions/dto/institution-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `name` | `string` | Não | Sem validação de entrada declarada neste campo |
| `acronym` | `string` | Não | Sem validação de entrada declarada neste campo |
| `countryId` | `string` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### CreateJuryWithImageDto

Fonte: [leviata-api/src/juris/DTOs/create-jury-with-cover.dto.ts](<leviata-api/src/juris/DTOs/create-jury-with-cover.dto.ts>).

Herança: `extends CreateJuryDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `cover` | `any` | Sim | Sem validação de entrada declarada neste campo |

### CreateJuryDto

Fonte: [leviata-api/src/juris/DTOs/create-jury.dto.ts](<leviata-api/src/juris/DTOs/create-jury.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `date` | `Date` | Não | `@IsNotEmpty()`<br>`@IsDate()`<br>`Transform(…)` |
| `description` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `location` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(255)` |
| `judges` | `string[]` | Sim | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |
| `jurors` | `string[]` | Sim | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |
| `prosecutors` | `string[]` | Sim | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |
| `defenders` | `string[]` | Sim | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |
| `bailiffs` | `string[]` | Sim | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |
| `documentUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `registrationUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `recordingUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `meetingUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |

### JuriesQueryDto

Fonte: [leviata-api/src/juris/DTOs/jury-query.dto.ts](<leviata-api/src/juris/DTOs/jury-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `dateFrom` | `string` | Sim | `@IsOptional()`<br>`@IsDateString()` |
| `dateTo` | `string` | Sim | `@IsOptional()`<br>`@IsDateString()` |
| `judgeId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `jurorId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `prosecutorId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `defenderId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `bailiffId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `sortBy` | `'title' \| 'date' \| 'createdAt'` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@IsIn(['title', 'date', 'createdAt'])` |
| `sortOrder` | `'asc' \| 'desc'` | Sim | `@IsOptional()`<br>`@IsIn(['asc', 'desc'])` |

### JuryResponseDto

Fonte: [leviata-api/src/juris/DTOs/jury-response.dto.ts](<leviata-api/src/juris/DTOs/jury-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `coverUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `date` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `images` | `ImageResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `judges` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `jurors` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `prosecutors` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `defenders` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `bailiffs` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `registrationUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `recordingUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `meetingUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### UpdateJuryDto

Fonte: [leviata-api/src/juris/DTOs/update.juri.dto.ts](<leviata-api/src/juris/DTOs/update.juri.dto.ts>).

Herança: `extends PartialType(CreateJuryDto)`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `coverUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |

### MailTestDto

Fonte: [leviata-api/src/mail/mail.dto.ts](<leviata-api/src/mail/mail.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `to` | `string` | Não | `Transform(…)`<br>`@IsEmail()`<br>`@MaxLength(254)` |

### MailTokenDto

Fonte: [leviata-api/src/mail/mail.dto.ts](<leviata-api/src/mail/mail.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `token` | `string` | Não | `@IsString()`<br>`@Length(16, 1024)` |

### MailDeliveriesQueryDto

Fonte: [leviata-api/src/mail/mail.dto.ts](<leviata-api/src/mail/mail.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Não / inicial: `1` | `@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100000)` |
| `limit` | `number` | Não / inicial: `20` | `@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |

### CreateMeetingWithImageDto

Fonte: [leviata-api/src/meetings/DTOs/create-book-with-cover.dto.ts](<leviata-api/src/meetings/DTOs/create-book-with-cover.dto.ts>).

Herança: `extends CreateMeetingDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `cover` | `any` | Sim | Sem validação de entrada declarada neste campo |

### CreateMeetingDto

Fonte: [leviata-api/src/meetings/DTOs/create-meeting.dto.ts](<leviata-api/src/meetings/DTOs/create-meeting.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `type` | `MeetingType` | Não | `@IsEnum(MeetingType)` |
| `isInternal` | `boolean` | Sim | `@IsOptional()`<br>`Transform(…)`<br>`@IsBoolean()` |
| `description` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `date` | `Date` | Não | `@IsNotEmpty()`<br>`@IsDate()`<br>`Transform(…)` |
| `location` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(255)` |
| `registrationUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `meetingUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `recordingUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `speakers` | `string[]` | Sim | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |

### MeetingsQueryDto

Fonte: [leviata-api/src/meetings/DTOs/meeting-query.dto.ts](<leviata-api/src/meetings/DTOs/meeting-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `type` | `MeetingType` | Sim | `@IsOptional()`<br>`@IsEnum(MeetingType)` |
| `isInternal` | `boolean` | Sim | `@IsOptional()`<br>`Transform(…)`<br>`@IsBoolean()` |
| `speakerId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `dateFrom` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `dateTo` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `sortBy` | `'title' \| 'date' \| 'createdAt'` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@IsIn(['title', 'date', 'createdAt'])` |
| `sortOrder` | `'asc' \| 'desc'` | Sim | `@IsOptional()`<br>`@IsIn(['asc', 'desc'])` |

### MeetingResponseDto

Fonte: [leviata-api/src/meetings/DTOs/meeting-response.dto.ts](<leviata-api/src/meetings/DTOs/meeting-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `type` | `MeetingType` | Não | Sem validação de entrada declarada neste campo |
| `isInternal` | `boolean` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `coverUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `description` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `date` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `location` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `registrationUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `meetingUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `recordingUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `speakers` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `images` | `ImageResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `presentedWorks` | `{ id: string; slug: string; title: string }[]` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### UpdateMeetingDto

Fonte: [leviata-api/src/meetings/DTOs/update.meeting.dto.ts](<leviata-api/src/meetings/DTOs/update.meeting.dto.ts>).

Herança: `extends PartialType(CreateMeetingDto)`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `coverUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |

### CreateNewsWithImageDto

Fonte: [leviata-api/src/news/DTOs/create-news-with-cover.dto.ts](<leviata-api/src/news/DTOs/create-news-with-cover.dto.ts>).

Herança: `extends CreateNewsDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `cover` | `any` | Sim | Sem validação de entrada declarada neste campo |

### CreateNewsDto

Fonte: [leviata-api/src/news/DTOs/create-news.dto.ts](<leviata-api/src/news/DTOs/create-news.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `description` | `string` | Não | `@IsString()` |
| `date` | `Date` | Não | `@IsNotEmpty()`<br>`@IsDate()`<br>`Transform(…)` |
| `category` | `NewsCategory` | Não | `@IsEnum(NewsCategory)` |
| `isInternal` | `boolean` | Sim | `@IsOptional()`<br>`Transform(…)`<br>`@IsBoolean()` |
| `externalUrl` | `string` | Sim | `@IsOptional()`<br>`@IsUrl()` |
| `relatedType` | `NewsRelatedType` | Sim | `@IsOptional()`<br>`@IsEnum(NewsRelatedType)` |
| `relatedId` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(255)` |

### NewsQueryDto

Fonte: [leviata-api/src/news/DTOs/news-query.dto.ts](<leviata-api/src/news/DTOs/news-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `category` | `NewsCategory` | Sim | `@IsOptional()`<br>`@IsEnum(NewsCategory)` |
| `isInternal` | `boolean` | Sim | `@IsOptional()`<br>`@Type(() => Boolean)`<br>`@IsBoolean()` |
| `dateFrom` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `dateTo` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `sortBy` | `'title' \| 'date' \| 'createdAt'` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@IsIn(['title', 'date', 'createdAt'])` |
| `sortOrder` | `'asc' \| 'desc'` | Sim | `@IsOptional()`<br>`@IsIn(['asc', 'desc'])` |

### NewsResponseDto

Fonte: [leviata-api/src/news/DTOs/news-response.dto.ts](<leviata-api/src/news/DTOs/news-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `description` | `string` | Não | Sem validação de entrada declarada neste campo |
| `coverUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `date` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `category` | `NewsCategory` | Não | Sem validação de entrada declarada neste campo |
| `isInternal` | `boolean` | Não | Sem validação de entrada declarada neste campo |
| `externalUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `relatedType` | `NewsRelatedType \| null` | Não | Sem validação de entrada declarada neste campo |
| `relatedId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `images` | `ImageResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### UpdateNewsDto

Fonte: [leviata-api/src/news/DTOs/update.news.dto.ts](<leviata-api/src/news/DTOs/update.news.dto.ts>).

Herança: `extends PartialType(CreateNewsDto)`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `coverUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |

### CreateNewsletterWithCoverDto

Fonte: [leviata-api/src/newsletter/DTOs/create-newsletter-with-cover.dto.ts](<leviata-api/src/newsletter/DTOs/create-newsletter-with-cover.dto.ts>).

Herança: `extends CreateNewsletterDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `cover` | `Express.Multer.File` | Sim | Sem validação de entrada declarada neste campo |

### CreateNewsletterDto

Fonte: [leviata-api/src/newsletter/DTOs/create-newsletter.dto.ts](<leviata-api/src/newsletter/DTOs/create-newsletter.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@IsNotEmpty()` |
| `subject` | `string` | Não | `@IsString()`<br>`@IsNotEmpty()` |
| `htmlContent` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `contentData` | `NewsletterContentDto` | Sim | `@IsOptional()`<br>`Transform(…)`<br>`@IsObject()`<br>`@ValidateNested()` |
| `coverUrl` | `string` | Sim | `@IsOptional()`<br>`@IsUrl()` |
| `publishedAt` | `string` | Sim | `@IsOptional()`<br>`@IsDateString()` |
| `sentAt` | `string` | Sim | `@IsOptional()`<br>`@IsDateString()` |

### NewsletterContentItemDto

Fonte: [leviata-api/src/newsletter/DTOs/newsletter-content.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-content.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | `@IsString()`<br>`@MaxLength(80)` |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(300)` |
| `text` | `string` | Não | `@IsString()`<br>`@MaxLength(20000)` |
| `details` | `string` | Não | `@IsString()`<br>`@MaxLength(500)` |
| `imageUrl` | `string` | Não | `@IsString()`<br>`@MaxLength(2000)` |
| `imageAlt` | `string` | Não | `@IsString()`<br>`@MaxLength(300)` |
| `linkUrl` | `string` | Não | `@IsString()`<br>`@MaxLength(2000)` |
| `linkLabel` | `string` | Não | `@IsString()`<br>`@MaxLength(100)` |

### NewsletterContentSectionDto

Fonte: [leviata-api/src/newsletter/DTOs/newsletter-content.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-content.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | `@IsString()`<br>`@MaxLength(80)` |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(200)` |
| `layout` | `'stories' \| 'briefs'` | Não | `@IsIn(['stories', 'briefs'])` |
| `items` | `NewsletterContentItemDto[]` | Não | `@IsArray()`<br>`@ArrayMaxSize(30)`<br>`@ValidateNested({ each: true })`<br>`@Type(() => NewsletterContentItemDto)` |

### NewsletterContentDto

Fonte: [leviata-api/src/newsletter/DTOs/newsletter-content.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-content.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `customHtml` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(200000)` |
| `version` | `1` | Não | `@Equals(1)` |
| `mode` | `\| 'visual'     \| 'html'` | Não | `@IsIn(['visual', 'html'])` |
| `template` | `'CLASSIC' \| 'EDITORIAL' \| 'MAGAZINE'` | Não | `@IsIn(['CLASSIC', 'EDITORIAL', 'MAGAZINE'])` |
| `background` | `'paper' \| 'white' \| 'ink'` | Não | `@IsIn(['paper', 'white', 'ink'])` |
| `frame` | `'double' \| 'line' \| 'none'` | Não | `@IsIn(['double', 'line', 'none'])` |
| `masthead` | `string` | Não | `@IsString()`<br>`@MaxLength(200)` |
| `tagline` | `string` | Não | `@IsString()`<br>`@MaxLength(500)` |
| `editionLabel` | `string` | Não | `@IsString()`<br>`@MaxLength(100)` |
| `intro` | `string` | Não | `@IsString()`<br>`@MaxLength(10000)` |
| `footer` | `string` | Não | `@IsString()`<br>`@MaxLength(2000)` |
| `sections` | `NewsletterContentSectionDto[]` | Não | `@IsArray()`<br>`@ArrayMaxSize(20)`<br>`@ValidateNested({ each: true })`<br>`@Type(() => NewsletterContentSectionDto)` |

### NewsletterPreviewDto

Fonte: [leviata-api/src/newsletter/DTOs/newsletter-preview.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-preview.dto.ts>).

Herança: `extends PartialType(   OmitType(CreateNewsletterDto, [     'coverUrl',     'title',     'subject',     'publishedAt',   ] as const), )`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(300)` |
| `subject` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(300)` |
| `publishedAt` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(80)` |
| `coverUrl` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(2000)` |

### NewsletterQueryDto

Fonte: [leviata-api/src/newsletter/DTOs/newsletter-query.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim / inicial: `1` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim / inicial: `10` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `sortBy` | `'title' \| 'publishedAt' \| 'sentAt' \| 'createdAt'` | Sim / inicial: `'createdAt'` | `@IsOptional()`<br>`@IsIn(['title', 'publishedAt', 'sentAt', 'createdAt'])` |
| `sortOrder` | `'asc' \| 'desc'` | Sim / inicial: `'desc'` | `@IsOptional()`<br>`@IsIn(['asc', 'desc'])` |

### NewsletterResponseDto

Fonte: [leviata-api/src/newsletter/DTOs/newsletter-response.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `subject` | `string` | Não | Sem validação de entrada declarada neste campo |
| `htmlContent` | `string` | Não | Sem validação de entrada declarada neste campo |
| `contentData` | `NewsletterContentDto \| null` | Sim | Sem validação de entrada declarada neste campo |
| `coverUrl` | `string \| null` | Sim | Sem validação de entrada declarada neste campo |
| `pdfUrl` | `\| string     \| null` | Sim | Sem validação de entrada declarada neste campo |
| `pdfGeneratedAt` | `Date \| null` | Sim | Sem validação de entrada declarada neste campo |
| `publishedAt` | `Date \| null` | Sim | Sem validação de entrada declarada neste campo |
| `sentAt` | `Date \| null` | Sim | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### NewsletterSubscriptionResponseDto

Fonte: [leviata-api/src/newsletter/DTOs/newsletter-subscription-response.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-subscription-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `message` | `string` | Não | Sem validação de entrada declarada neste campo |

### SubscribeNewsletterDto

Fonte: [leviata-api/src/newsletter/DTOs/subscribe-newsletter.dto.ts](<leviata-api/src/newsletter/DTOs/subscribe-newsletter.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `email` | `string` | Não | `Transform(…)`<br>`@IsEmail({}, { message: 'Informe um e-mail válido.' })`<br>`@MaxLength(254, { message: 'O e-mail deve ter no máximo 254 caracteres.' })` |
| `name` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsString({ message: 'O nome deve ser um texto.' })`<br>`@MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres.' })` |
| `cellphone` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsString({ message: 'O telefone deve ser um texto.' })`<br>`@MaxLength(30, { message: 'O telefone deve ter no máximo 30 caracteres.' })` |

### UpdateNewsletterDto

Fonte: [leviata-api/src/newsletter/DTOs/update-newsletter.dto.ts](<leviata-api/src/newsletter/DTOs/update-newsletter.dto.ts>).

Herança: `extends PartialType(CreateNewsletterDto)`.

Sem campos próprios: consultar o contrato herdado.

### NotificationsQueryDto

Fonte: [leviata-api/src/notifications/notifications.dto.ts](<leviata-api/src/notifications/notifications.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Não / inicial: `1` | `@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100000)` |
| `limit` | `number` | Não / inicial: `15` | `@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `type` | `NotificationType` | Sim | `@IsOptional()`<br>`@IsEnum(NotificationType)` |
| `status` | `'all' \| 'unread' \| 'pending' \| 'scheduled'` | Sim | `@IsOptional()`<br>`@IsIn(['all', 'unread', 'pending', 'scheduled'])` |

### CreateNotificationDto

Fonte: [leviata-api/src/notifications/notifications.dto.ts](<leviata-api/src/notifications/notifications.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `type` | `'INFO' \| 'REMINDER'` | Não | `@IsIn(['INFO', 'REMINDER'])` |
| `title` | `string` | Não | `Transform(…)`<br>`@IsString()`<br>`@Length(3, 120)` |
| `message` | `string` | Não | `Transform(…)`<br>`@IsString()`<br>`@Length(3, 500)` |
| `visibleAt` | `string` | Sim | `@IsOptional()`<br>`@IsDateString({ strict: true })` |

### CreatePersonWithImageDto

Fonte: [leviata-api/src/people/DTOs/create-person-with-image.dto.ts](<leviata-api/src/people/DTOs/create-person-with-image.dto.ts>).

Herança: `extends CreatePersonDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `image` | `any` | Sim | Sem validação de entrada declarada neste campo |

### CreatePersonDto

Fonte: [leviata-api/src/people/DTOs/create-person.dto.ts](<leviata-api/src/people/DTOs/create-person.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `name` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `category` | `PersonCategory` | Não | `@IsEnum(PersonCategory)` |
| `isActive` | `boolean` | Sim | `@IsOptional()`<br>`Transform(…)`<br>`@IsBoolean()` |
| `displayOrder` | `number` | Sim | `@IsOptional()`<br>`Transform(…)`<br>`@IsInt()`<br>`@Min(0)` |
| `birthDate` | `Date` | Sim | `@IsOptional()`<br>`Transform(…)` |
| `bio` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `orcid` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `email` | `string \| null` | Sim | `Transform(…)`<br>`@ValidateIf(requiresProfileField)`<br>`@IsString()`<br>`@IsEmail()` |
| `lattesUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `website` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `linkedinUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `honorificTitle` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `nationalityId` | `string \| null` | Sim | `Transform(…)`<br>`@ValidateIf(requiresProfileField)`<br>`@IsUUID()` |
| `academicTitleId` | `string \| null` | Sim | `Transform(…)`<br>`@ValidateIf(requiresProfileField)`<br>`@IsUUID()` |
| `institutionId` | `string \| null` | Sim | `Transform(…)`<br>`@ValidateIf(requiresProfileField)`<br>`@IsUUID()` |

### PeopleQueryDto

Fonte: [leviata-api/src/people/DTOs/people-query.dto.ts](<leviata-api/src/people/DTOs/people-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim / inicial: `1` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim / inicial: `10` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `category` | `PersonCategory` | Sim | `@IsOptional()`<br>`@IsEnum(PersonCategory)` |
| `excludeCategory` | `PersonCategory` | Sim | `@IsOptional()`<br>`@IsEnum(PersonCategory)` |
| `institutionId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `academicTitleId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `nationalityId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `isActive` | `string` | Sim | `@IsOptional()`<br>`@IsBooleanString()` |
| `sortBy` | `string` | Sim / inicial: `'displayOrder'` | `@IsOptional()`<br>`@IsIn(['name', 'displayOrder', 'createdAt'])` |
| `sortOrder` | `'asc' \| 'desc'` | Sim / inicial: `'asc'` | `@IsOptional()`<br>`Transform(…)`<br>`@IsIn(['asc', 'desc'])` |

### PersonResponseDto

Fonte: [leviata-api/src/people/DTOs/person-response.dto.ts](<leviata-api/src/people/DTOs/person-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `name` | `string` | Não | Sem validação de entrada declarada neste campo |
| `category` | `PersonCategory` | Não | Sem validação de entrada declarada neste campo |
| `isActive` | `boolean` | Não | Sem validação de entrada declarada neste campo |
| `displayOrder` | `number` | Não | Sem validação de entrada declarada neste campo |
| `imageUrl` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `birthDate` | `Date` | Sim | Sem validação de entrada declarada neste campo |
| `bio` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `orcid` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `email` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `lattesUrl` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `website` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `linkedinUrl` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `honorificTitle` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `nationalityId` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `academicTitleId` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `institutionId` | `string` | Sim | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### UpdatePersonDto

Fonte: [leviata-api/src/people/DTOs/update-person.dto.ts](<leviata-api/src/people/DTOs/update-person.dto.ts>).

Herança: `extends PartialType(CreatePersonDto)`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `imageUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |

### CreatePresentedWorkDto

Fonte: [leviata-api/src/presentedWorks/DTOs/create-presented-work.dto.ts](<leviata-api/src/presentedWorks/DTOs/create-presented-work.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `date` | `Date` | Não | `@IsNotEmpty()`<br>`@IsDate()`<br>`Transform(…)` |
| `location` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(255)` |
| `meetingId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID()` |
| `documentUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `registrationUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `recordingUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `meetingUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `authors` | `string[]` | Não | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |

### PresentedWorksQueryDto

Fonte: [leviata-api/src/presentedWorks/DTOs/presented-work-query.dto.ts](<leviata-api/src/presentedWorks/DTOs/presented-work-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `dateFrom` | `string` | Sim | `@IsOptional()`<br>`@IsDateString()` |
| `dateTo` | `string` | Sim | `@IsOptional()`<br>`@IsDateString()` |
| `meetingId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID('4')` |
| `authorId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID('4')` |
| `sortBy` | `'title' \| 'date' \| 'createdAt'` | Sim | `@IsOptional()`<br>`@IsIn(['title', 'date', 'createdAt'])` |
| `sortOrder` | `'asc' \| 'desc'` | Sim | `@IsOptional()`<br>`@IsIn(['asc', 'desc'])` |

### PresentedWorkResponseDto

Fonte: [leviata-api/src/presentedWorks/DTOs/presented-work-response.dto.ts](<leviata-api/src/presentedWorks/DTOs/presented-work-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `date` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `location` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `images` | `ImageResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `meetingId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `meeting` | `MeetingResponseDto \| null` | Não | Sem validação de entrada declarada neste campo |
| `authors` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `documentUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `registrationUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `recordingUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `meetingUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### UpdatePresentedWorkDto

Fonte: [leviata-api/src/presentedWorks/DTOs/update-presented-work.dto.ts](<leviata-api/src/presentedWorks/DTOs/update-presented-work.dto.ts>).

Herança: `extends PartialType(   CreatePresentedWorkDto, )`.

Sem campos próprios: consultar o contrato herdado.

### ReportItemDto

Fonte: [leviata-api/src/reports/dto/summary-report-response.dto.ts](<leviata-api/src/reports/dto/summary-report-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `key` | `string` | Não | Sem validação de entrada declarada neste campo |
| `label` | `string` | Não | Sem validação de entrada declarada neste campo |
| `total` | `number` | Não | Sem validação de entrada declarada neste campo |

### SummaryReportResponseDto

Fonte: [leviata-api/src/reports/dto/summary-report-response.dto.ts](<leviata-api/src/reports/dto/summary-report-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `generatedAt` | `string` | Não | Sem validação de entrada declarada neste campo |
| `totalRecords` | `number` | Não | Sem validação de entrada declarada neste campo |
| `items` | `ReportItemDto[]` | Não | Sem validação de entrada declarada neste campo |

### CreateSearchWithCoverDto

Fonte: [leviata-api/src/research/DTOs/create-search-with-cover.dto.ts](<leviata-api/src/research/DTOs/create-search-with-cover.dto.ts>).

Herança: `extends CreateSearchDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `cover` | `any` | Sim | Sem validação de entrada declarada neste campo |

### CreateSearchDto

Fonte: [leviata-api/src/research/DTOs/create-search.dto.ts](<leviata-api/src/research/DTOs/create-search.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `content` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `people` | `string[]` | Não | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |
| `images` | `string[]` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsArray()`<br>`@IsUUID('4', { each: true })` |
| `supports` | `string[]` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsArray()`<br>`@IsUUID('4', { each: true })` |

### ResearchQueryDto

Fonte: [leviata-api/src/research/DTOs/research-query.dto.ts](<leviata-api/src/research/DTOs/research-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim / inicial: `1` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim / inicial: `10` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |

### SearchResponseDto

Fonte: [leviata-api/src/research/DTOs/search-response.dto.ts](<leviata-api/src/research/DTOs/search-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `coverUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `coverPublicId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `content` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `people` | `{     id: string;     firstName: string;     lastName: string;   }[]` | Não | Sem validação de entrada declarada neste campo |
| `images` | `ImageResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `supports` | `ImageResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### UpdateSearchDto

Fonte: [leviata-api/src/research/DTOs/update.search.dto.ts](<leviata-api/src/research/DTOs/update.search.dto.ts>).

Herança: `extends PartialType(CreateSearchDto)`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `coverUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |

### CreateResearchInstrumentWithPdfDto

Fonte: [leviata-api/src/researchInstruments/DTOs/create-researchInstrument-with-pdf.dto.ts](<leviata-api/src/researchInstruments/DTOs/create-researchInstrument-with-pdf.dto.ts>).

Herança: `extends CreateResearchInstrumentDto`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `pdf` | `any` | Sim | Sem validação de entrada declarada neste campo |

### CreateResearchInstrumentDto

Fonte: [leviata-api/src/researchInstruments/DTOs/create-researchInstrument.dto.ts](<leviata-api/src/researchInstruments/DTOs/create-researchInstrument.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@MaxLength(255)` |
| `type` | `ResearchInstrumentType` | Não | `@IsEnum(ResearchInstrumentType)` |
| `startYear` | `number` | Sim | `Transform(…)`<br>`@IsInt()`<br>`@Min(0)` |
| `endYear` | `number` | Sim | `Transform(…)`<br>`@IsInt()`<br>`@Min(0)` |
| `content` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `externalUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |
| `people` | `string[]` | Não | `Transform(…)`<br>`@IsArray()`<br>`@ArrayMinSize(1)`<br>`@IsUUID('4', { each: true })` |

### ResearchInstrumentsQueryDto

Fonte: [leviata-api/src/researchInstruments/DTOs/researchInstrument-query.dto.ts](<leviata-api/src/researchInstruments/DTOs/researchInstrument-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim / inicial: `1` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim / inicial: `10` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `type` | `ResearchInstrumentType` | Sim | `@IsOptional()`<br>`@IsEnum(ResearchInstrumentType)` |
| `startYear` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()` |
| `endYear` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()` |

### ResearchInstrumentResponseDto

Fonte: [leviata-api/src/researchInstruments/DTOs/researchInstrument-response.dto.ts](<leviata-api/src/researchInstruments/DTOs/researchInstrument-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `type` | `ResearchInstrumentType` | Não | Sem validação de entrada declarada neste campo |
| `startYear` | `number \| null` | Não | Sem validação de entrada declarada neste campo |
| `endYear` | `number \| null` | Não | Sem validação de entrada declarada neste campo |
| `content` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `pdfUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `externalUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `people` | `PersonResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### UpdateResearchInstrumentDto

Fonte: [leviata-api/src/researchInstruments/DTOs/update-researchInstrument.dto.ts](<leviata-api/src/researchInstruments/DTOs/update-researchInstrument.dto.ts>).

Herança: `extends PartialType(   CreateResearchInstrumentDto, )`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `pdfUrl` | `string` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsUrl()` |

### CreateScheduleDto

Fonte: [leviata-api/src/schedule/DTOs/create-schedule.dto.ts](<leviata-api/src/schedule/DTOs/create-schedule.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `Transform(…)`<br>`@IsString()`<br>`@IsNotEmpty()`<br>`@MaxLength(255)` |
| `subtitle` | `string \| null` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(255)` |
| `description` | `string \| null` | Sim | `@IsOptional()`<br>`@IsString()` |
| `date` | `string` | Não | `@IsDateString({ strict: true })` |
| `endDate` | `string \| null` | Sim | `@IsOptional()`<br>`@IsDateString({ strict: true })` |
| `location` | `string \| null` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(255)` |
| `externalUrl` | `string \| null` | Sim | `@IsOptional()`<br>`@IsUrl({ protocols: ['http', 'https'], require_protocol: true })` |

### ScheduleQueryDto

Fonte: [leviata-api/src/schedule/DTOs/schedule-query.dto.ts](<leviata-api/src/schedule/DTOs/schedule-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim / inicial: `1` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim / inicial: `10` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `dateFrom` | `string` | Sim | `@IsOptional()`<br>`@IsDateString({ strict: true })` |
| `dateTo` | `string` | Sim | `@IsOptional()`<br>`@IsDateString({ strict: true })` |
| `sortBy` | `'title' \| 'date' \| 'createdAt'` | Sim / inicial: `'date'` | `@IsOptional()`<br>`@IsIn(['title', 'date', 'createdAt'])` |
| `sortOrder` | `'asc' \| 'desc'` | Sim / inicial: `'asc'` | `@IsOptional()`<br>`@IsIn(['asc', 'desc'])` |

### ScheduleResponseDto

Fonte: [leviata-api/src/schedule/DTOs/schedule-response.dto.ts](<leviata-api/src/schedule/DTOs/schedule-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `subtitle` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `description` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `date` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `endDate` | `Date \| null` | Não | Sem validação de entrada declarada neste campo |
| `location` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `externalUrl` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### UpdateScheduleDto

Fonte: [leviata-api/src/schedule/DTOs/update-schedule.dto.ts](<leviata-api/src/schedule/DTOs/update-schedule.dto.ts>).

Herança: `extends PartialType(CreateScheduleDto, {   skipNullProperties: false, })`.

Sem campos próprios: consultar o contrato herdado.

### CreateThematicDto

Fonte: [leviata-api/src/thematics/DTOs/create-thematic.dto.ts](<leviata-api/src/thematics/DTOs/create-thematic.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@IsNotEmpty()`<br>`Transform(…)`<br>`@MaxLength(255)` |
| `description` | `string \| null` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(1000)` |
| `mainVideoId` | `string \| null` | Sim | `@IsOptional()`<br>`@IsUUID('4')` |
| `coordinatorId` | `string \| null` | Sim | `@IsOptional()`<br>`@IsUUID('4')` |
| `additionalVideos` | `ThematicVideoInputDto[]` | Sim | `@ValidateIf((_object, value: unknown) => value !== undefined)`<br>`@IsArray()`<br>`@ValidateNested({ each: true })`<br>`@Type(() => ThematicVideoInputDto)` |

### ThematicsQueryDto

Fonte: [leviata-api/src/thematics/DTOs/thematic-query.dto.ts](<leviata-api/src/thematics/DTOs/thematic-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `coordinatorId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID('4')` |
| `mainVideoId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID('4')` |
| `sortBy` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `sortOrder` | `'asc' \| 'desc'` | Sim | `@IsOptional()`<br>`@IsString()` |

### ThematicResponseDto

Fonte: [leviata-api/src/thematics/DTOs/thematic-response.dto.ts](<leviata-api/src/thematics/DTOs/thematic-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `slug` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `description` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `mainVideoId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `mainVideo` | `VideoResponseDto \| null` | Não | Sem validação de entrada declarada neste campo |
| `coordinatorId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `coordinator` | `PersonResponseDto \| null` | Não | Sem validação de entrada declarada neste campo |
| `additionalVideos` | `ThematicVideoResponseDto[]` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### ThematicVideoInputDto

Fonte: [leviata-api/src/thematics/DTOs/thematic-video-input.dto.ts](<leviata-api/src/thematics/DTOs/thematic-video-input.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Sim | `@ValidateIf((_object, value: unknown) => value !== undefined)`<br>`@IsUUID('4')` |
| `videoId` | `string` | Não | `@IsUUID('4')` |
| `personId` | `string \| null` | Sim | `@IsOptional()`<br>`@IsUUID('4')` |
| `title` | `string` | Não | `Transform(…)`<br>`@IsString()`<br>`@IsNotEmpty()`<br>`@MaxLength(255)` |
| `description` | `string \| null` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@MaxLength(1000)` |

### ThematicVideoResponseDto

Fonte: [leviata-api/src/thematics/DTOs/thematic-video-response.dto.ts](<leviata-api/src/thematics/DTOs/thematic-video-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `thematicId` | `string` | Não | Sem validação de entrada declarada neste campo |
| `videoId` | `string` | Não | Sem validação de entrada declarada neste campo |
| `personId` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `description` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `video` | `VideoResponseDto` | Não | Sem validação de entrada declarada neste campo |
| `person` | `PersonResponseDto \| null` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### UpdateThematicDto

Fonte: [leviata-api/src/thematics/DTOs/update-thematic.dto.ts](<leviata-api/src/thematics/DTOs/update-thematic.dto.ts>).

Herança: `extends PartialType(CreateThematicDto, {   skipNullProperties: false, })`.

Sem campos próprios: consultar o contrato herdado.

### CreateUserDto

Fonte: [leviata-api/src/users/DTOs/create-user.dto.ts](<leviata-api/src/users/DTOs/create-user.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `email` | `string` | Não | `Transform(…)`<br>`@IsEmail()`<br>`@MaxLength(254)` |
| `password` | `string` | Não | `@IsString()`<br>`@MinLength(8)`<br>`@MaxLength(72)` |
| `firstName` | `string \| null` | Sim | `@IsOptional()`<br>`Transform(…)`<br>`@IsString()`<br>`@MaxLength(100)` |
| `lastName` | `string \| null` | Sim | `@IsOptional()`<br>`Transform(…)`<br>`@IsString()`<br>`@MaxLength(100)` |
| `role` | `Role` | Sim | `@ValidateIf((_object, value: unknown) => value !== undefined)`<br>`@IsEnum(Role)` |
| `isActive` | `boolean` | Sim | `@ValidateIf((_object, value: unknown) => value !== undefined)`<br>`@IsBoolean()` |

### UpdateAccountDto

Fonte: [leviata-api/src/users/DTOs/update-account.dto.ts](<leviata-api/src/users/DTOs/update-account.dto.ts>).

Herança: `extends PartialType(   PickType(CreateUserDto, [     'email',     'firstName',     'lastName',     'password',   ] as const),   { skipNullProperties: false }, )`.

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `currentPassword` | `string` | Sim | `@IsOptional()`<br>`@IsString()`<br>`@IsNotEmpty()`<br>`@MaxLength(72)` |

### UpdateUserDto

Fonte: [leviata-api/src/users/DTOs/update-user.dto.ts](<leviata-api/src/users/DTOs/update-user.dto.ts>).

Herança: `extends PartialType(CreateUserDto, {   skipNullProperties: false, })`.

Sem campos próprios: consultar o contrato herdado.

### UsersQueryDto

Fonte: [leviata-api/src/users/DTOs/user-query.dto.ts](<leviata-api/src/users/DTOs/user-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim / inicial: `1` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim / inicial: `15` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `role` | `Role` | Sim | `@IsOptional()`<br>`@IsEnum(Role)` |
| `isActive` | `string` | Sim | `@IsOptional()`<br>`@IsBooleanString()` |
| `sortBy` | `'email' \| 'firstName' \| 'createdAt'` | Sim / inicial: `'createdAt'` | `@IsOptional()`<br>`@IsIn(['email', 'firstName', 'createdAt'])` |
| `sortOrder` | `'asc' \| 'desc'` | Sim / inicial: `'desc'` | `@IsOptional()`<br>`@IsIn(['asc', 'desc'])` |

### UserResponseDto

Fonte: [leviata-api/src/users/DTOs/user-response.dto.ts](<leviata-api/src/users/DTOs/user-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `email` | `string` | Não | Sem validação de entrada declarada neste campo |
| `firstName` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `lastName` | `string \| null` | Não | Sem validação de entrada declarada neste campo |
| `role` | `Role` | Não | Sem validação de entrada declarada neste campo |
| `isActive` | `boolean` | Não | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updatedAt` | `Date` | Não | Sem validação de entrada declarada neste campo |

### CreateVideoDto

Fonte: [leviata-api/src/videos/DTOs/create-video.dto.ts](<leviata-api/src/videos/DTOs/create-video.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `title` | `string` | Não | `@IsString()`<br>`@IsNotEmpty()` |
| `videoUrl` | `string` | Não | `@IsUrl()`<br>`@IsNotEmpty()` |
| `description` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `people` | `string[]` | Sim | `Transform(…)`<br>`@IsOptional()`<br>`@IsArray()`<br>`@IsUUID('4', { each: true })` |

### UpdateVideoDto

Fonte: [leviata-api/src/videos/DTOs/update-video.dto.ts](<leviata-api/src/videos/DTOs/update-video.dto.ts>).

Herança: `extends PartialType(CreateVideoDto)`.

Sem campos próprios: consultar o contrato herdado.

### VideosQueryDto

Fonte: [leviata-api/src/videos/DTOs/video-query.dto.ts](<leviata-api/src/videos/DTOs/video-query.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `page` | `number` | Sim / inicial: `1` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)` |
| `limit` | `number` | Sim / inicial: `10` | `@IsOptional()`<br>`@Type(() => Number)`<br>`@IsInt()`<br>`@Min(1)`<br>`@Max(100)` |
| `search` | `string` | Sim | `@IsOptional()`<br>`@IsString()` |
| `personId` | `string` | Sim | `@IsOptional()`<br>`@IsUUID('4')` |
| `sortBy` | `'title' \| 'createdAt'` | Sim / inicial: `'createdAt'` | `@IsOptional()`<br>`@IsString()` |
| `sortOrder` | `'asc' \| 'desc'` | Sim / inicial: `'desc'` | `@IsOptional()`<br>`@IsString()` |

### VideoResponseDto

Fonte: [leviata-api/src/videos/DTOs/video-response.dto.ts](<leviata-api/src/videos/DTOs/video-response.dto.ts>).

| Campo próprio | Tipo TypeScript | ? no tipo / inicialização | Transformação e validação |
| --- | --- | --- | --- |
| `id` | `string` | Não | Sem validação de entrada declarada neste campo |
| `title` | `string` | Não | Sem validação de entrada declarada neste campo |
| `embedLink` | `string` | Não | Sem validação de entrada declarada neste campo |
| `description` | `string \| null` | Sim | Sem validação de entrada declarada neste campo |
| `people` | `PersonResponseDto[]` | Sim | Sem validação de entrada declarada neste campo |
| `createdAt` | `Date` | Não | Sem validação de entrada declarada neste campo |
| `updateddAt` | `Date` | Não | Sem validação de entrada declarada neste campo |


## 5. Dicionário de dados e relações

O schema usa PostgreSQL e o gerador `prisma-client-js`. Um campo com `?` aceita null no banco; `[]` indica coleção relacionada; `@unique` cria unicidade; `@relation` registra vínculos; `@@index` declara índices. As declarações abaixo reproduzem o schema de dados do snapshot, sem registros reais.

| Grupo | Modelos e responsabilidade |
| --- | --- |
| Identidade | `User`: acesso, papel, estado e versão de sessão |
| Pessoas e catálogos | `Person`, `Country`, `Institution`, `AcademicTitle`: perfil acadêmico e vínculos institucionais |
| Publicações | `Book`, `Article`, `PresentedWork`: obras, artigos/dossiês e apresentações |
| Atividades | `Jury`, `Meeting`, `Board`, `Schedule`: júris, eventos, bancas e agenda avulsa |
| Pesquisa | `Search`, `ResearchInstrument`, `Thematic`, `ThematicVideo`, `Video`: projetos, fontes, linhas e mídias |
| Comunicação | `News`, `Newsletter`, `NewsletterSubscriber`, `NewsletterDelivery`: notícias, edições, inscritos e histórico |
| Fila de e-mail | `NewsletterMailCampaign`, `NewsletterMailRecipient`: cópia da edição e estado por destinatário |
| Participação | `Comment`, `Notification`, `NotificationRead`: contribuições, revisão e leitura individual |
| Mídia | `Image`: URL/public ID/legenda e pertencimento a galeria ou apoiadores |

As principais relações são pessoa ↔ autores/participantes; temática → vídeo principal/coordenador e vídeos adicionais; encontro → trabalhos; atividades/notícias → imagens; pesquisa ↔ fotos/apoiadores; newsletter → campanha → destinatários; inscrito → entregas; comentário → notificação; notificação ↔ leituras por usuário.

### 5.1 Todos os enums

#### Role
```prisma
enum Role {
SUPER_ADMIN
  ADMIN
}
```

#### ArticleType
```prisma
enum ArticleType {
ARTICLE
  DOSSIER
}
```

#### PersonCategory
```prisma
enum PersonCategory {
DOCENTE
  DISCENTE
  EGRESSO
  PESQUISADOR
  SUB_COORDENADOR
  COORDENADOR
  EXTERNO
}
```

#### ResearchInstrumentType
```prisma
enum ResearchInstrumentType {
DOSSIER
  CATALOG
  DATABASE
}
```

#### MeetingType
```prisma
enum MeetingType {
SEMINAR
  MEETING
  DOCUMENTARY
}
```

#### NewsCategory
```prisma
enum NewsCategory {
PUBLICATION // publicação
  EVENT       // evento
  AWARD       // premiação
  INTERNSHIP  // estágio
  RESEARCH    // pesquisa
  PODCAST     // podcast
  CALL        // convocação
}
```

#### NewsRelatedType
```prisma
enum NewsRelatedType {
BOARD
  JURY
  MEETING
  PUBLICATION
  RESEARCH_INSTRUMENT
  THEMATIC
  RESEARCH
  PRESENTED_WORK
}
```

#### CommentTarget
```prisma
enum CommentTarget {
THEMATIC
  RESEARCH_INSTRUMENT
  BOARD
  JURY
  MEETING
  PRESENTED_WORK
  RESEARCH
  NEWS
}
```

#### CommentStatus
```prisma
enum CommentStatus {
PENDING
  APPROVED
}
```

#### NotificationType
```prisma
enum NotificationType {
INFO
  REMINDER
  COMMENT
}
```

#### NotificationResolution
```prisma
enum NotificationResolution {
APPROVED
  REJECTED
}
```

#### NewsletterMailRecipientStatus
```prisma
enum NewsletterMailRecipientStatus {
PENDING
  SENDING
  SENT
  FAILED
  SKIPPED
  UNKNOWN
}
```


### 5.2 Todos os modelos, campos, índices e relações

#### User
```prisma
model User {
id        String   @id @default(uuid())
  email     String   @unique
  password  String

  firstName String?
  lastName  String?

  hashedRefreshToken String?
  tokenVersion Int @default(0)

  role      Role     @default(ADMIN)

  isActive  Boolean  @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
  deletedById String?
  approvedComments Comment[]
  notificationReads NotificationRead[]
  createdNotifications Notification[]
}
```

#### Comment
```prisma
model Comment {
id String @id @default(uuid())
  targetType CommentTarget
  targetId String
  fullName String @db.VarChar(120)
  text String @db.VarChar(300)
  status CommentStatus @default(PENDING)
  createdAt DateTime @default(now()) @db.Timestamptz(3)
  approvedAt DateTime? @db.Timestamptz(3)
  approvedById String?
  approvedBy User? @relation(fields: [approvedById], references: [id], onDelete: SetNull)
  notification Notification?

  @@index([targetType, targetId, status, createdAt])
}
```

#### Notification
```prisma
model Notification {
id String @id @default(uuid())
  type NotificationType
  title String @db.VarChar(120)
  message String @db.VarChar(500)
  targetTitle String?
  targetPath String?
  commentId String? @unique
  comment Comment? @relation(fields: [commentId], references: [id], onDelete: SetNull)
  resolution NotificationResolution?
  resolvedAt DateTime? @db.Timestamptz(3)
  createdById String?
  createdBy User? @relation(fields: [createdById], references: [id], onDelete: SetNull)
  createdAt DateTime @default(now()) @db.Timestamptz(3)
  visibleAt DateTime @default(now()) @db.Timestamptz(3)
  reads NotificationRead[]

  @@index([visibleAt, createdAt])
  @@index([type, resolution])
}
```

#### NotificationRead
```prisma
model NotificationRead {
notificationId String
  notification Notification @relation(fields: [notificationId], references: [id], onDelete: Cascade)
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  readAt DateTime @default(now()) @db.Timestamptz(3)

  @@id([notificationId, userId])
  @@index([userId])
}
```

#### AcademicTitle
```prisma
model AcademicTitle {
id           String @id @default(uuid())
  
  name         String @unique
  abbreviation String @unique

  people       Person[]
}
```

#### Country
```prisma
model Country {
id        String @id @default(uuid())

  code      String @unique
  name      String @unique

  institutions Institution[]
  nationals Person[] @relation("Nationality")
}
```

#### Institution
```prisma
model Institution {
id   String @id @default(uuid())

  name String @unique
  acronym String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  countryId String
  country   Country @relation(fields: [countryId], references: [id])

  people Person[]

  deletedAt   DateTime?
  deletedById String?
}
```

#### Person
```prisma
model Person {
id String @id @default(uuid())

  slug String @unique
  isActive Boolean @default(true)
  displayOrder Int @default(0)

  imageUrl String?
  imagePublicId String?
  
  name String

  birthDate DateTime?

  category PersonCategory

  bio  String?
  orcid String?
  email String?

  lattesUrl String?
  website String?
  linkedinUrl String?

  honorificTitle String?

  videos Video[]

  books Book[]

  articles Article[]

  thematicVideos ThematicVideo[]

  researchInstruments ResearchInstrument[]

  boardCandidates Board[] @relation("BoardCandidate")

  boardAdvisors Board[] @relation("BoardAdvisor")

  boardMemberships Board[] @relation("BoardMembers")

  juryJudges Jury[] @relation("JuryJudges")

  juryJurors Jury[] @relation("JuryJurors")

  juryProsecutors Jury[] @relation("JuryProsecutors")

  juryDefenders Jury[] @relation("JuryDefenders")

  juryBailiffs Jury[] @relation("JuryBailiffs")

  nationalityId String?
  nationality   Country? @relation("Nationality", fields: [nationalityId], references: [id])

  academicTitleId String?
  academicTitle   AcademicTitle? @relation(fields: [academicTitleId], references: [id])

  institutionId String?
  institution   Institution? @relation(fields: [institutionId], references: [id])
  
  coordinatedThematics Thematic[] @relation("ThematicCoordinator")

  meetingsAsSpeaker Meeting[] @relation("MeetingSpeakers")

  presentedWorks PresentedWork[]

  searchs Search[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt   DateTime?
  deletedById String?
}
```

#### Book
```prisma
model Book {
id String @id @default(uuid())

  slug String @unique

  title       String
  subtitle    String?

  coverUrl    String?
  coverPublicId   String?
  
  description String?

  isbn        String?

  year        Int?

  publisher   String?

  externalUrl String?

  authors Person[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt   DateTime?
  deletedById String?
}
```

#### Article
```prisma
model Article {
id String @id @default(uuid())

  slug String @unique

  title String

  coverUrl String?
  coverPublicId String?

  type ArticleType @default(ARTICLE)

  journal String?

  volume  String?

  year Int?

  doi String?

  summary String?

  externalUrl String?

  authors Person[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt   DateTime?
  deletedById String?
}
```

#### Board
```prisma
model Board {
id String @id @default(uuid())

  slug String @unique

  title String

  candidateId String
  candidate   Person @relation("BoardCandidate", fields: [candidateId], references: [id])

  advisorId String
  advisor   Person @relation("BoardAdvisor", fields: [advisorId], references: [id])

  members Person[] @relation("BoardMembers")

  date DateTime

  images Image[]

  meetingUrl String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?
}
```

#### Jury
```prisma
model Jury {
id String @id @default(uuid())

  slug String @unique

  title String

  coverUrl String?
  coverPublicId String?

  description String?

  date DateTime

  location String?

  images Image[]

  judges Person[] @relation("JuryJudges")

  jurors Person[] @relation("JuryJurors")

  prosecutors Person[] @relation("JuryProsecutors")

  defenders Person[] @relation("JuryDefenders")

  bailiffs Person[] @relation("JuryBailiffs")

  documentUrl String?
  registrationUrl String?
  recordingUrl String?
  meetingUrl String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?
}
```

#### PresentedWork
```prisma
model PresentedWork {
id String @id @default(uuid())

  slug String @unique

  title String

  date DateTime

  location String?

  images Image[]

  meetingId String?
  meeting   Meeting? @relation(fields: [meetingId], references: [id])

  authors Person[]

  documentUrl String?
  registrationUrl String?
  recordingUrl String?
  meetingUrl String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?
}
```

#### Meeting
```prisma
model Meeting {
id String @id @default(uuid())
  slug String @unique

  type MeetingType

  isInternal Boolean @default(true)

  title String

  coverUrl String?
  coverPublicId String?

  description String?

  date DateTime

  location String?

  registrationUrl String?
  recordingUrl String?
  meetingUrl String?

  speakers Person[] @relation("MeetingSpeakers")

  presentedWorks PresentedWork[]

  images Image[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?
}
```

#### Image
```prisma
model Image {
id String @id @default(uuid())

  imageUrl String

  publicId String? @unique

  title String?

  description String?

  boardId String?
  board Board? @relation(fields: [boardId], references: [id])

  juryId String?
  jury Jury? @relation(fields: [juryId], references: [id])

  meetingId String?
  meeting Meeting? @relation(fields: [meetingId], references: [id])

  presentedWorkId String?
  presentedWork PresentedWork? @relation(fields: [presentedWorkId], references: [id])

  newsId String?
  news News? @relation(fields: [newsId], references: [id])

  photos Search[] @relation("SearchImages")
  supports Search[] @relation("SearchSupports")

  createdAt DateTime @default(now())

  @@index([newsId])
}
```

#### Video
```prisma
model Video {
id String @id @default(uuid())
  slug String @unique

  title String

  embedLink String

  description String?

  people Person[]

  thematicMain Thematic[] @relation("ThematicMainVideo")

  thematicVideos ThematicVideo[]
  
  createdAt DateTime @default(now())
  deletedAt DateTime?
  deletedById String?
}
```

#### ThematicVideo
```prisma
model ThematicVideo {
id String @id @default(uuid())

  thematicId String
  thematic   Thematic @relation(fields: [thematicId], references: [id])

  videoId String
  video   Video @relation(fields: [videoId], references: [id])

  personId String?
  person Person? @relation(fields: [personId], references: [id])

  title String

  description String?

  createdAt DateTime @default(now())
}
```

#### Thematic
```prisma
model Thematic {
id String @id @default(uuid())
  slug String @unique

  title String

  description String?

  mainVideoId String?
  mainVideo Video? @relation("ThematicMainVideo", fields: [mainVideoId], references: [id])

  coordinatorId String?
  coordinator Person? @relation("ThematicCoordinator", fields: [coordinatorId], references: [id])

  additionalVideos ThematicVideo[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?
}
```

#### News
```prisma
model News {
id String @id @default(uuid())

  slug String @unique

  title String

  description String

  coverUrl String?
  coverPublicId String?

  date DateTime

  category NewsCategory

  isInternal Boolean @default(false)

  externalUrl String?

  relatedType NewsRelatedType?
  relatedId String?

  images Image[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?
}
```

#### Schedule
```prisma
model Schedule {
id String @id @default(uuid())

  slug String @unique

  title String
  subtitle String?
  description String? @db.Text

  date DateTime
  endDate DateTime?

  location String?
  externalUrl String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?

  @@index([deletedAt, date])
}
```

#### NewsletterMailCampaign
```prisma
model NewsletterMailCampaign {
id String @id @default(uuid())
  newsletterId String @unique
  newsletter Newsletter @relation(fields: [newsletterId], references: [id])
  title String
  subject String
  htmlContent String @db.Text
  pdfContent Bytes?
  slug String
  createdById String
  createdAt DateTime @default(now()) @db.Timestamptz(3)
  completedAt DateTime? @db.Timestamptz(3)
  cancelledAt DateTime? @db.Timestamptz(3)
  recipients NewsletterMailRecipient[]
}
```

#### NewsletterMailRecipient
```prisma
model NewsletterMailRecipient {
id String @id @default(uuid())
  campaignId String
  campaign NewsletterMailCampaign @relation(fields: [campaignId], references: [id])
  subscriberId String
  subscriber NewsletterSubscriber @relation(fields: [subscriberId], references: [id])
  email String
  status NewsletterMailRecipientStatus @default(PENDING)
  attempts Int @default(0)
  nextAttemptAt DateTime @default(now()) @db.Timestamptz(3)
  lastAttemptAt DateTime? @db.Timestamptz(3)
  sentAt DateTime? @db.Timestamptz(3)
  messageId String?
  errorCode String?
  createdAt DateTime @default(now()) @db.Timestamptz(3)
  updatedAt DateTime @updatedAt @db.Timestamptz(3)

  @@unique([campaignId, subscriberId])
  @@index([status, nextAttemptAt])
  @@index([lastAttemptAt])
  @@index([sentAt])
}
```

#### Newsletter
```prisma
model Newsletter {
id String @id @default(uuid())

  slug String @unique

  title String

  subject String

  htmlContent String @db.Text

  contentData Json?

  coverUrl String?
  coverPublicId String?

  pdfUrl String?
  pdfContent Bytes?
  pdfSourceHash String?
  pdfGeneratedAt DateTime?

  publishedAt DateTime?

  sentAt DateTime?

  deliveries NewsletterDelivery[]
  mailCampaign NewsletterMailCampaign?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?
}
```

#### NewsletterSubscriber
```prisma
model NewsletterSubscriber {
id String @id @default(uuid())

  email String @unique

  name String?

  cellphone String?

  allowEmail Boolean @default(true)

  allowWhatsapp Boolean @default(false)

  isActive Boolean @default(true)

  subscribedAt DateTime @default(now())

  unsubscribedAt DateTime?

  deliveries NewsletterDelivery[]
  mailRecipients NewsletterMailRecipient[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?
}
```

#### NewsletterDelivery
```prisma
model NewsletterDelivery {
id String @id @default(uuid())

  newsletterId String
  newsletter Newsletter @relation(fields: [newsletterId], references: [id])

  subscriberId String
  subscriber NewsletterSubscriber @relation(fields: [subscriberId], references: [id])

  sentAt DateTime

  openedAt DateTime?

  clickedAt DateTime?

  errorMessage String?
}
```

#### ResearchInstrument
```prisma
model ResearchInstrument {
id String @id @default(uuid())

  slug String @unique

  type ResearchInstrumentType

  title String

  startYear Int?
  endYear Int?

  content String?

  pdfUrl String?
  pdfPublicId String?

  externalUrl String?

  people Person[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?
}
```

#### Search
```prisma
model Search {
id String @id @default(uuid())

  slug String @unique

  title String

  coverUrl String?
  coverPublicId String?

  content String?

  people Person[]

  images Image[] @relation("SearchImages")

  supports Image[] @relation("SearchSupports")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deletedAt DateTime?
  deletedById String?
}
```


## 6. Evolução do banco

O histórico possui **38 migrations**. A ordem dos diretórios é parte da evolução do schema; não exclua migrations aplicadas para “limpar” o projeto. Alterações de estrutura são aplicadas por Prisma Migrate, e o cliente precisa ser regenerado após mudança de schema.

| Ordem | Diretório / script SQL |
| --- | --- |
| 1 | [20260711113254_academic_title_unique](<leviata-api/prisma/migrations/20260711113254_academic_title_unique/migration.sql>) |
| 2 | [20260711132728_add_institution_acronym](<leviata-api/prisma/migrations/20260711132728_add_institution_acronym/migration.sql>) |
| 3 | [20260717125517_update_person_model](<leviata-api/prisma/migrations/20260717125517_update_person_model/migration.sql>) |
| 4 | [20260803114134_add_refresh_token](<leviata-api/prisma/migrations/20260803114134_add_refresh_token/migration.sql>) |
| 5 | [20260804191319_add_slug_in_class](<leviata-api/prisma/migrations/20260804191319_add_slug_in_class/migration.sql>) |
| 6 | [20260805135056_add_image_id_in_person](<leviata-api/prisma/migrations/20260805135056_add_image_id_in_person/migration.sql>) |
| 7 | [20260807150353_add_cover_id_in_book](<leviata-api/prisma/migrations/20260807150353_add_cover_id_in_book/migration.sql>) |
| 8 | [20260807193535_change_cover_for_cover_url_in_book](<leviata-api/prisma/migrations/20260807193535_change_cover_for_cover_url_in_book/migration.sql>) |
| 9 | [20260812175023_change_cover_for_cover_url_in_article](<leviata-api/prisma/migrations/20260812175023_change_cover_for_cover_url_in_article/migration.sql>) |
| 10 | [20260817130938_change_cover_for_cover_url_in_news](<leviata-api/prisma/migrations/20260817130938_change_cover_for_cover_url_in_news/migration.sql>) |
| 11 | [20260820122530_add_fields_creted_updated_deleted](<leviata-api/prisma/migrations/20260820122530_add_fields_creted_updated_deleted/migration.sql>) |
| 12 | [20260821130941_add_fields_cover_in_meeting](<leviata-api/prisma/migrations/20260821130941_add_fields_cover_in_meeting/migration.sql>) |
| 13 | [20260827124145_add_fields_cover_in_jury](<leviata-api/prisma/migrations/20260827124145_add_fields_cover_in_jury/migration.sql>) |
| 14 | [20260903200928_add_fields_in_jury](<leviata-api/prisma/migrations/20260903200928_add_fields_in_jury/migration.sql>) |
| 15 | [20260904123428_add_fields_in_presentedwork](<leviata-api/prisma/migrations/20260904123428_add_fields_in_presentedwork/migration.sql>) |
| 16 | [20260909131551_add_fields_in_thematic](<leviata-api/prisma/migrations/20260909131551_add_fields_in_thematic/migration.sql>) |
| 17 | [20260911134509_add_field_slug_in_video](<leviata-api/prisma/migrations/20260911134509_add_field_slug_in_video/migration.sql>) |
| 18 | [20260911140702_add_field_in_video](<leviata-api/prisma/migrations/20260911140702_add_field_in_video/migration.sql>) |
| 19 | [20260914141556_add_field_in_research_instrument](<leviata-api/prisma/migrations/20260914141556_add_field_in_research_instrument/migration.sql>) |
| 20 | [20260915131530_add_model_research](<leviata-api/prisma/migrations/20260915131530_add_model_research/migration.sql>) |
| 21 | [20260915131735_add_fields_research](<leviata-api/prisma/migrations/20260915131735_add_fields_research/migration.sql>) |
| 22 | [20260915175545_change_name_model](<leviata-api/prisma/migrations/20260915175545_change_name_model/migration.sql>) |
| 23 | [20260915180113_add_field_in_search](<leviata-api/prisma/migrations/20260915180113_add_field_in_search/migration.sql>) |
| 24 | [20261001120000_add_schedule](<leviata-api/prisma/migrations/20261001120000_add_schedule/migration.sql>) |
| 25 | [20261004120000_add_gallery_metadata](<leviata-api/prisma/migrations/20261004120000_add_gallery_metadata/migration.sql>) |
| 26 | [20261004180000_add_user_account_management](<leviata-api/prisma/migrations/20261004180000_add_user_account_management/migration.sql>) |
| 27 | [20261023120000_add_meeting_is_internal](<leviata-api/prisma/migrations/20261023120000_add_meeting_is_internal/migration.sql>) |
| 28 | [20261023130000_add_research_news_destination](<leviata-api/prisma/migrations/20261023130000_add_research_news_destination/migration.sql>) |
| 29 | [20261023140000_add_documentary_meeting_type](<leviata-api/prisma/migrations/20261023140000_add_documentary_meeting_type/migration.sql>) |
| 30 | [20261023150000_add_news_gallery](<leviata-api/prisma/migrations/20261023150000_add_news_gallery/migration.sql>) |
| 31 | [20261024120000_add_presented_work_news_destination](<leviata-api/prisma/migrations/20261024120000_add_presented_work_news_destination/migration.sql>) |
| 32 | [20261024130000_add_newsletter_cover_upload](<leviata-api/prisma/migrations/20261024130000_add_newsletter_cover_upload/migration.sql>) |
| 33 | [20261024160000_add_comments_and_notifications](<leviata-api/prisma/migrations/20261024160000_add_comments_and_notifications/migration.sql>) |
| 34 | [20261025120000_add_news_comment_target](<leviata-api/prisma/migrations/20261025120000_add_news_comment_target/migration.sql>) |
| 35 | [20261025150000_add_external_person_category](<leviata-api/prisma/migrations/20261025150000_add_external_person_category/migration.sql>) |
| 36 | [20261025180000_add_newsletter_mail_queue](<leviata-api/prisma/migrations/20261025180000_add_newsletter_mail_queue/migration.sql>) |
| 37 | [20261026190000_add_newsletter_content_data](<leviata-api/prisma/migrations/20261026190000_add_newsletter_content_data/migration.sql>) |
| 38 | [20261026200000_add_newsletter_generated_pdf](<leviata-api/prisma/migrations/20261026200000_add_newsletter_generated_pdf/migration.sql>) |


Os seeds mantêm países, títulos, instituições e uma conta administrativa inicial. O seed de superadmin contém credenciais fixas de desenvolvimento, cujos valores não são reproduzidos nesta documentação; reveja esse arquivo antes de executar seed em outro ambiente. Migration não é backup, e `migrate reset` não é um procedimento de publicação.
