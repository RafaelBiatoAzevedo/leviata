# Envio de newsletters no admin

O formulário oferece **Enviar para todos os inscritos após salvar**, desmarcado
por padrão. Se escolhida, a edição é cadastrada primeiro e depois encaminhada à
fila de envio pelo seu ID. Para enviar, a data de publicação deve ser de hoje ou
anterior, e o serviço de e-mail precisa estar configurado e ativo.

É possível salvar sem enviar. Após criar, o admin abre os detalhes da edição,
onde fica o painel **Envio e entregas**. Se o cadastro funcionar e a solicitação
de envio falhar, a edição permanece salva e o admin é direcionado para conferir
seu acompanhamento, sem criar uma cópia da newsletter.

A data do último envio é informativa. O formulário não altera `sentAt`; a API
preenche esse campo quando o processamento termina sem pendências ou falhas.

## Enviar depois

Na listagem, o ícone **Enviar e acompanhar entregas** abre o painel da edição.
O botão **Enviar para todos os inscritos** mostra o assunto e a quantidade atual
de destinatários elegíveis antes de confirmar a operação.

O envio considera cadastros ativos, não excluídos e com autorização para e-mail.
Cadastros que já receberam a mesma edição são excluídos. A API revalida o
consentimento antes de cada envio e evita duplicar campanhas ao receber
requisições repetidas.

O painel atualiza o progresso a cada cinco segundos enquanto há processamento,
oferece cancelamento de envios pendentes e permite tentar novamente apenas as
falhas confirmadas. Entregas cujo resultado é incerto são identificadas como
**A conferir**, sem reenvio automático.

## Consultar registros

- **Destinatários** mostra a fila, o status, o número de tentativas e a data de envio.
- **Envios realizados** consulta os registros de `NewsletterDelivery`, incluindo
  os históricos anteriores à fila. Mostra nome, e-mail e data de aceitação pelo SMTP.

Uma entrada em `NewsletterDelivery` é criada pela API somente após o SMTP aceitar
a mensagem. Criar a newsletter, clicar no botão ou colocar um destinatário na
fila não gera um registro de envio realizado. A gravação do status de sucesso e
desse registro ocorre na mesma transação.

Enquanto as credenciais não forem configuradas, os botões de envio ficam
indisponíveis com uma explicação; o cadastro continua funcionando normalmente.

## Integração

O frontend utiliza as rotas protegidas do módulo `mail`, incluindo:

- `GET /mail/newsletters/:id/audience` para conferir os totais elegíveis.
- `POST /mail/newsletters/:id/send` para iniciar o envio.
- `GET /mail/newsletters/:id/status` e `/deliveries` para o acompanhamento.
- `GET /mail/newsletters/:id/delivery-records` para consultar `NewsletterDelivery`.

Validação do fluxo administrativo: `npm run test:newsletter-delivery`.
Os testes de integração da API usam PostgreSQL isolado e SMTP simulado, sem
enviar e-mails reais.
