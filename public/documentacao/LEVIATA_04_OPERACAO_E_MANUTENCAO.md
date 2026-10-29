# Instalação, operação, segurança e manutenção

## 1. Escopo operacional e pré-requisitos

Esta seção permite preparar os projetos e entender o que falta confirmar antes de uma implantação. Não executa criação de contas, alteração de DNS, configuração de Gmail, publicação ou migração de dados entre ambientes.

O ambiente observado possui Node **24.13.0**, npm **11.6.2** e Yarn Classic **1.22.22**. O frontend instalado usa Vite 8, e a API usa NestJS 11, Prisma 7 e Puppeteer 25. O Puppeteer instalado exige Node a partir de 22.12; Vite/Prisma também têm restrições de versão. Usar o Node 24 observado evita assumir que um Node 18 ou 20 atende ao conjunto inteiro.

São necessários PostgreSQL acessível, Chrome/Chromium compatível para gerar PDF e acesso à rede para Cloudinary/SMTP quando essas funções forem usadas. Docker, Redis, BullMQ, Kubernetes e uma infraestrutura de analytics não fazem parte da configuração encontrada.

## 2. Instalar e executar localmente

### 2.1 Frontend

Na pasta `LEVIATA/leviata`:

```sh
npm ci
```

Crie ou revise o `.env.local` com um endereço base apropriado:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

```sh
npm run dev
```

Vite usa normalmente a porta 5173, podendo escolher outra se estiver ocupada. O endereço efetivo aparece no terminal. O arquivo `.env.example` atual contém a chave antiga `API_BASE_URL`, mas o código lê **`VITE_API_BASE_URL`**; seguir apenas o nome do exemplo não configura o Axios. Reinicie o dev server após mudar ambiente. Variáveis `VITE_*` entram no bundle público e não devem conter segredos.

Há `package-lock.json` e `yarn.lock` no frontend. O fluxo desta documentação usa npm e `package-lock.json`; não alterne gerenciadores sem revisar os locks. Na API, o lock existente é Yarn.

### 2.2 API

Na pasta `LEVIATA/leviata-api`:

```sh
yarn install --frozen-lockfile
npx prisma generate
```

Configure `.env` usando as variáveis da próxima seção, com credenciais reais mantidas fora da documentação. O banco deve existir e estar acessível. Antes de aplicar migrations em banco com dados, tenha backup e confira o destino.

```sh
npx prisma migrate deploy
yarn start:dev
```

No ambiente de desenvolvimento, a API escuta `PORT` ou 3000. Abra `http://localhost:3000/docs` e teste uma consulta pública. Os seeds podem preparar os catálogos de referência, mas o de superadmin precisa ser revisado primeiro por conter valores fixos. Não há cadastro público para criar o primeiro administrador.

### 2.3 Arquivos e funções que dependem de integração

Sem Cloudinary configurado, as funções de upload não estão prontas. Sem Chrome disponível, salvar uma newsletter que exija gerar PDF pode falhar. Com e-mail desativado, o cadastro de conteúdos/inscritos continua funcionando; os botões de envio informam a indisponibilidade.

Para obter o navegador esperado pelo Puppeteer quando o download foi pulado na instalação:

```sh
npx puppeteer browsers install chrome
```

Também é possível apontar `NEWSLETTER_PDF_EXECUTABLE_PATH` para um executável já instalado. O cache configurado fica em `.cache/puppeteer`, ignorado pelo Git. A aplicação tenta caminhos conhecidos de Chrome/Chromium antes de depender do navegador baixado. Não use a desativação do sandbox como solução padrão de instalação.

## 3. Todas as variáveis de configuração

Os nomes abaixo vieram de leituras de `process.env`, `ConfigService`, configuração dos módulos e arquivos de exemplo. Os valores privados dos `.env` locais não foram lidos para montar esta tabela. Valores mostrados são padrões do código ou exemplos sem segredos.

| Nome | Onde | Necessidade | Padrão / finalidade |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Front | Obrigatória para apontar a API | Sem padrão no código; exemplo http://localhost:3000. Pública no bundle. |
| `DATABASE_URL` | API/Prisma | Obrigatória | Conexão PostgreSQL; segredo operacional. Usada em runtime, CLI e seeds. |
| `PORT` | API | Opcional | 3000; só terá efeito de listen quando o bootstrap executar app.listen. |
| `NODE_ENV` | API | Opcional com efeito crítico | production atualmente pula o listen; também exige HTTPS nas URLs de mail. |
| `JWT_SECRET` | API | Obrigatória | Assinatura/validação do token de acesso. Manter secreta. |
| `JWT_EXPIRES_IN` | API | Opcional | 1d; duração do access token. |
| `JWT_REFRESH_SECRET` | API | Definir explicitamente | Segredo do refresh token; manter distinto e privado. |
| `JWT_REFRESH_EXPIRES_IN` | API | Opcional | 7d; duração do refresh token. |
| `CLOUDINARY_CLOUD_NAME` | API | Para mídia | Nome da conta de mídia; configurar junto da chave e segredo. |
| `CLOUDINARY_API_KEY` | API | Para mídia | Chave do SDK; nunca colocar no VITE_*. |
| `CLOUDINARY_API_SECRET` | API | Para mídia | Segredo do SDK; nunca colocar no front ou na documentação. |
| `MAIL_ENABLED` | API | Opcional | false; libera novos envios apenas quando configuração também está válida. |
| `MAIL_WORKER_ENABLED` | API | Opcional | true; controla processamento automático, sujeito a MAIL_ENABLED/prontidão. |
| `MAIL_AUTH_MODE` | API | Para envio | oauth2 por padrão; alternativa app-password. |
| `MAIL_SMTP_USER` | API | Para envio | Padrão leviataeocativeiro@gmail.com; usuário da autenticação SMTP. |
| `MAIL_FROM_EMAIL` | API | Para envio | Padrão leviataeocativeiro@gmail.com; remetente visível. |
| `MAIL_REPLY_TO` | API | Para envio | Usa remetente por padrão; destino de respostas. |
| `MAIL_FROM_NAME` | API | Opcional | Leviatã e o Cativeiro; nome do remetente, sem CR/LF. |
| `MAIL_SMTP_HOST` | API | Opcional | smtp.gmail.com. |
| `MAIL_SMTP_PORT` | API | Opcional | 465; inteiro entre 1 e 65535. |
| `MAIL_SMTP_SECURE` | API | Opcional | true quando porta 465; aceita apenas true/false. |
| `MAIL_GOOGLE_CLIENT_ID` | API | OAuth2 | ID do aplicativo Google; requerido nesse modo. |
| `MAIL_GOOGLE_CLIENT_SECRET` | API | OAuth2 | Segredo do aplicativo Google; não publicar. |
| `MAIL_GOOGLE_REFRESH_TOKEN` | API | OAuth2 | Refresh de autorização SMTP; não é o refresh JWT da aplicação. |
| `MAIL_GMAIL_APP_PASSWORD` | API | Senha de aplicativo | Requerida somente nesse modo; espaços são removidos. Não usar senha comum. |
| `MAIL_UNSUBSCRIBE_SECRET` | API | Para envio/descadastro | Ao menos 32 bytes; chave estável HMAC-SHA256 dos links de descadastro. |
| `MAIL_PUBLIC_API_URL` | API | Para envio | http://localhost:3000; base externa para descadastro. HTTPS em produção. |
| `MAIL_PORTAL_URL` | API | Para envio | http://localhost:5173; endereço do portal nos e-mails. HTTPS em produção. |
| `MAIL_DAILY_LIMIT` | API | Opcional | 400; intervalo permitido 1–500 por janela de 24 horas interna. |
| `MAIL_SEND_INTERVAL_MS` | API | Opcional | 5000; permitido 1000–3600000 ms entre reservas. |
| `MAIL_MAX_ATTEMPTS` | API | Opcional | 3; permitido 1–5 para falhas confirmadas. |
| `NEWSLETTER_PDF_EXECUTABLE_PATH` | API | Opcional | Caminho de Chrome/Chromium existente; se vazio, usa descoberta/navegador Puppeteer. |
| `NEWSLETTER_PDF_NO_SANDBOX` | API | Opcional | false; só considerar true em ambiente isolado que efetivamente exija esse ajuste. |
| `MAIL_TEST_DATABASE_URL` | Testes API | Somente integração de mail | Banco separado explícito, SMTP simulado; sem fallback automático para o banco do app. |
| `COMMENTS_TEST_DATABASE_URL` | Testes API | Somente integração de comentários | Banco separado para moderação/notificações HTTP. |
| `PEOPLE_TEST_DATABASE_URL` | Testes API | Somente integração de pessoas | Banco separado para categoria EXTERNO, filtros e relações. |
| `PUPPETEER_SKIP_DOWNLOAD` | Instalação | Opcional da dependência | Pula download do navegador durante instalação; ainda será necessário um Chrome disponível para PDF. |


As três variáveis de integração de teste (`MAIL_TEST_DATABASE_URL`, `COMMENTS_TEST_DATABASE_URL`, `PEOPLE_TEST_DATABASE_URL`) não são o banco de produção: apontam explicitamente para bancos descartáveis/separados usados pelas respectivas suítes. Sem a variável necessária, algumas suítes são ignoradas.

## 4. Preparar o envio de newsletters

1. Mantenha `MAIL_ENABLED=false` durante a preparação. Salvar conteúdo não exige ativar envio.
2. Configure remetente, usuário SMTP e reply-to para `leviataeocativeiro@gmail.com`, conforme o endereço definido para o projeto.
3. Escolha `MAIL_AUTH_MODE=oauth2` e preencha client ID, client secret e refresh token do Google, ou selecione `app-password` e use uma senha de aplicativo. Não use a senha comum da conta como senha de aplicativo.
4. Gere uma chave de assinatura estável para descadastro (`MAIL_UNSUBSCRIBE_SECRET`, ao menos 32 bytes). Trocar essa chave invalida links anteriormente assinados.
5. Defina as URLs públicas corretas da API e do portal; em produção a configuração de e-mail exige HTTPS. A URL da API precisa permitir que o destinatário acesse o descadastro.
6. Consulte `GET /mail/status` com uma sessão administrativa. A resposta informa nomes das configurações faltantes e nunca entrega os segredos.
7. Ative o envio apenas depois de revisar o destino e a conta. `POST /mail/verify` confere autenticação SMTP sem mandar mensagem.
8. Use o envio de teste para um destinatário escolhido antes de confirmar uma campanha real. O teste efetivamente envia um e-mail com anexo.

OAuth2 é a opção recomendada no arquivo de exemplo do projeto; a disponibilidade de senha de aplicativo depende da conta Google. Consulte as orientações atuais do provedor ao cadastrar as chaves. Os limites internos de 400/dia e cinco segundos não garantem que a conta do Gmail permita esse volume, nem medem uso da mesma conta por outros sistemas.

## 5. Limites e comportamento de recursos

| Recurso | Limite ou comportamento confirmado no código |
| --- | --- |
| JSON | 2 MB no parser da API; payloads com várias seções podem atingir esse limite antes dos máximos individuais |
| Upload genérico | `UploadModule` declara 20 MB para os módulos que o importam; verifique validação específica do endpoint |
| Galeria | Imagens JPEG/PNG/WebP/GIF/AVIF, menos de 10 MB, com validação de conteúdo |
| Imagens internas de newsletter | JPEG/PNG/WebP até 10 MB; endpoint autenticado próprio |
| Comentários | Nome 3–120, texto 3–300, cinco tentativas/minuto/IP por instância |
| Aviso/lembrete | Título 3–120 e mensagem 3–500; agendamento com fuso |
| PDF gerado | Máximo 15 MB; fila local de até quatro trabalhos pendentes; um render por vez por instância |
| Ativos remotos do PDF | DNS validado/fixado, bloqueio de endereços privados, limite de redirecionamentos, 10 MB por ativo e timeout |
| Renderização PDF | JavaScript da página desativado; requisições restritas a tipos de ativos; falha em imagem/fonte pode impedir a gravação |
| SMTP | Cota/intervalo/tentativas configuráveis; consentimento rechecado antes da mensagem |
| Resultado incerto | Sem repetição automática; conferir SMTP para evitar duplicidade |

Os limites de um upload específico não devem ser generalizados para todas as capas legadas. O módulo comum não substitui a checagem de MIME/tamanho de cada controller. PDFs e HTML de boletins podem consumir espaço significativo no banco, sobretudo por cópias de campanhas.

## 6. Builds, testes e qualidade

### 6.1 Scripts exatos dos dois projetos

### leviata

| Script | Comando exato |
| --- | --- |
| `dev` | `vite` |
| `build` | `tsc -b && vite build` |
| `lint` | `eslint .` |
| `preview` | `vite preview` |
| `test:gallery` | `node --test --test-isolation=none test/gallery.test.mjs` |
| `test:document-viewer` | `node --test --test-isolation=none test/document-viewer.test.cjs` |
| `test:pagination` | `node --test --test-isolation=none test/pagination.test.cjs` |
| `test:admin` | `node --test --test-isolation=none test/admin-responsive.test.cjs test/admin-sidebar.test.cjs test/admin-login.test.cjs` |
| `test:people` | `node --test --test-isolation=none test/people.test.cjs` |
| `test:books` | `node --test --test-isolation=none test/books.test.mjs` |
| `test:newsletter` | `node --test --test-isolation=none test/newsletter.test.cjs` |
| `test:newsletter-delivery` | `node --test --test-isolation=none test/newsletter-delivery.test.cjs` |
| `test:newsletter-composer` | `node --test --test-isolation=none test/newsletter-composer.test.cjs` |
| `test:timeline` | `node --test --test-isolation=none test/timeline.test.cjs` |
| `test:presented-works` | `node --test --test-isolation=none test/presented-works.test.cjs test/presented-work-details.test.cjs` |
| `test:navigation` | `node --test --test-isolation=none test/navigation.test.cjs` |
| `test:users` | `node --test --test-isolation=none test/users.test.mjs` |
| `test:thematics` | `node --test --test-isolation=none test/thematics.test.mjs` |
| `test:portal` | `node --test --test-isolation=none test/portal-api.test.cjs` |
| `test:theme` | `node --test --test-isolation=none test/theme.test.cjs` |
| `test:news` | `node --test --test-isolation=none test/news.test.cjs test/news-gallery-form.test.cjs` |

### leviata-api

| Script | Comando exato |
| --- | --- |
| `build` | `nest build` |
| `format` | `prettier --write "src/**/*.ts" "test/**/*.ts"` |
| `start` | `nest start` |
| `start:dev` | `nest start --watch` |
| `start:debug` | `nest start --debug --watch` |
| `start:prod` | `node dist/main` |
| `lint` | `eslint "{src,apps,libs,test}/**/*.ts" --fix` |
| `test` | `jest` |
| `test:watch` | `jest --watch` |
| `test:cov` | `jest --coverage` |
| `test:debug` | `node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand` |
| `test:e2e` | `jest --config ./test/jest-e2e.json` |
| `test:gallery` | `NODE_OPTIONS=--experimental-vm-modules jest --runInBand --testPathPatterns=images/` |
| `test:mail` | `jest --runInBand --testPathPatterns=mail/` |
| `test:mail:e2e` | `jest --config ./test/jest-mail-e2e.json --runInBand` |


No front, `test:admin` inclui tabela responsiva, sidebar e login. Outras suítes cobrem comentários, links, temas, paginação, publicações, galerias, PDF e newsletter. Na API, as suítes Jest cobrem regras, repositórios, controllers e integrações. O inventário de arquivos de teste está no volume de rastreabilidade; quantidade de arquivos não é porcentagem de cobertura.

As suítes de frontend podem registrar carregadores CommonJS/TypeScript globais. Algumas dependem de execução separada por arquivo ou de mocks para `import.meta.env`. Não chame a aplicação “100% testada” com base somente na contagem de rotas ou de arquivos. Documentos anteriores de `docs/` registram falhas de baseline em testes antigos; esse histórico não comprova o resultado de uma execução atual.

Integrações de teste de mail substituem SMTP/Cloudinary/renderizador por serviços simulados. Testes reais de PDF têm objetivo diferente: conferir o resultado visual de Chrome com conteúdo representativo. Não execute testes de integração com `DATABASE_URL` de produção nem envie campanhas reais para validar layout.

### 6.2 Validação antes de disponibilizar uma alteração

Revise o diff, rode os testes pertinentes, compile front e API, confira os fluxos modificados por perfil e aplique as migrations planejadas em ambiente apropriado. O script `lint` da API usa `--fix` e pode modificar arquivos; use `npx eslint <arquivos>` se desejar apenas conferir. O build do front pode avisar sobre chunks grandes; é uma oportunidade de divisão de código, não uma prova de falha na compilação.

## 7. Implantação: estado encontrado e pontos a resolver

O frontend gera `leviata/dist`, que pode ser servido como arquivos estáticos. O host precisa devolver `index.html` para rotas da SPA, inclusive acessos diretos a `/admin/...` e detalhes de conteúdo. HTTPS e o endereço de API correto devem estar preparados antes do build.

**A API atual não deve ser considerada pronta para subir em produção apenas com `start:prod`.** Em `src/main.ts`, `app.listen(port)` só é executado quando `NODE_ENV !== 'production'`. O build observado produz `dist/src/main.js`, enquanto o script `start:prod` aponta para `dist/main`. Não foi encontrado handler serverless ou configuração que resolva essa diferença. Esses dois pontos precisam ser ajustados e testados conforme o destino escolhido, antes de publicar.

O worker SMTP usa `setInterval` dentro do processo Nest. Requer processo persistente ou arquitetura de worker explicitamente adaptada; uma hospedagem que interrompe a execução após uma requisição não garante processamento da fila. Puppeteer precisa de navegador, memória, bibliotecas de sistema e permissões adequadas ao host.

O CORS atual é habilitado de maneira ampla por `app.enableCors()`. Não há configuração de origem permitida por variável nem middleware Helmet registrado no código inventariado. A autenticação não depende de cookies de sessão do navegador. Endurecimento de CORS/headers/proxy é uma decisão de implantação ainda a configurar, não uma proteção já presente que esta documentação possa prometer.

Neon pode ser utilizado como PostgreSQL por `DATABASE_URL`, mas não há cliente Neon dedicado no código. Arquivos de mídia dependem de Cloudinary; levar apenas o dump PostgreSQL não copia os binários hospedados externamente. O domínio/Registro.br e uma migração a partir do WordPress são projetos operacionais distintos e não foram realizados ao gerar estes documentos.

## 8. Backup, restauração e continuidade

Proteja pelo menos três conjuntos: banco PostgreSQL, mídias Cloudinary e configurações/segredos de ambiente. A restauração precisa manter IDs e vínculos de conteúdo, usuários, inscritos e entregas. PDFs gerados e cópias de campanha fazem parte do banco. Chaves de assinatura e segredos JWT também influenciam sessões e links já enviados.

Exemplo de backup, com variável dedicada e sem inserir senha no comando:

```sh
pg_dump --format=custom --file=leviata-backup.dump "$LEVIATA_BACKUP_DATABASE_URL"
```

Restaure primeiro em banco separado e valide registros, relações e leitura de arquivos. O comando de restore deve ser definido segundo o destino e a política de substituição; opções que limpam tabelas não são um procedimento seguro genérico. Migrations não recuperam conteúdo apagado. Não existe auditoria completa de alterações nem restauração de comentário recusado no produto atual.

Se a API reiniciar no meio de um envio, a fila persiste e o worker recupera estados antigos conforme as regras. UNKNOWN precisa de conferência manual. Um backup restaurado em ambiente de teste deve manter envio desativado para não reenviar comunicações.

## 9. Diagnóstico por sintoma

| Sintoma | Verificação recomendada |
| --- | --- |
| Front não consulta dados | Conferir `VITE_API_BASE_URL`, reinício/rebuild, API/porta e CORS |
| 401 repetidos | Conta ativa, `tokenVersion`, segredos JWT/refresh e token salvo; entrar novamente |
| 403 em moderação/usuários | Confirmar papel SUPER_ADMIN; leitura de aviso não concede moderação |
| 400 num formulário | Conferir DTO, campos extras, UUID, enums e normalização JSON/multipart |
| Ano opcional de instrumento rejeitado | Revisar a diferença documentada entre Zod e `CreateResearchInstrumentDto` |
| Conteúdo não aparece no portal | Conferir exclusão lógica, `isActive`, categoria EXTERNO/DISCENTE, tipo e `isInternal`; conferir o filtro da tela |
| Comentário não aparece | Conferir estado APPROVED, alvo/UUID e moderação pelo superadmin |
| Lembrete sem badge | Conferir `visibleAt`/fuso e leitura individual; lembrete futuro fica em Agendadas |
| PDF não é gerado | Instalação/caminho do Chrome, acesso às imagens/fontes públicas, timeout e limite de memória/tamanho |
| Imagem local/privada falha no PDF | O gerador bloqueia destinos privados de propósito; usar URL de mídia pública válida |
| SMTP desabilitado | Ver `GET /mail/status`, `MAIL_ENABLED`, credenciais e URLs |
| Campanha parada | Processo persistente, worker ativo, quota, intervalo, pausa de autenticação e estados UNKNOWN/FAILED |
| Entrega ausente em `NewsletterDelivery` | Enfileirar não equivale a sucesso; confirmar aceitação SMTP/estado SENT |
| E-mail não chegou, mas está SENT | Conferir caixa de spam/provedor; SENT não é recibo de leitura nem garantia de inbox |
| Exclusão de foto não remove arquivo antigo | Conferir `publicId` e se existe outro vínculo compartilhado |
| API não escuta em produção | Conferir condição `NODE_ENV` do bootstrap e caminho real do build |

## 10. Limitações explícitas e prioridades de manutenção

1. Corrigir/verificar bootstrap e entrypoint antes de qualquer implantação de produção.
2. Uniformizar o exemplo de ambiente do front e a gestão dos dois locks.
3. Rever sigilo/publicação de rascunhos de newsletter no backend, se esse for o requisito editorial.
4. Revisar seed com credenciais fixas, origens CORS e armazenamento de sessão conforme a política da instituição.
5. Harmonizar validação dos anos opcionais de instrumentos e revisar inconsistências entre metadados Swagger e status HTTP.
6. Conferir filtros de exclusão em consultas legadas por slug e comportamento de renomeação/colisão, já que não há redirecionamento genérico de URLs antigas.
7. Ampliar observabilidade e suíte de regressão; não há rastreamento de visitas/abertura de e-mail implementado.
8. Completar internacionalização se a equipe quiser navegação integral em inglês; a infraestrutura atual não traduz toda a interface.

Esses pontos foram documentados, não alterados por esta entrega. A documentação também não cria recuperação de senha, MFA, notificações push, disparo por WhatsApp, API pública para gerenciamento de inscritos ou acesso de visitante autenticado — recursos que não foram encontrados implementados.
