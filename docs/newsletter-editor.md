# Editor visual de newsletters

O cadastro abre no modo visual. O usuário escreve em campos comuns; a API gera
o documento HTML usado na prévia, no portal e no envio aos inscritos.

## Modelos

- **Memória (2023):** cabeçalho em cobre, títulos clássicos e seções de texto.
- **Editorial (2025):** cabeçalho escuro, contraste dourado e matérias com imagem.
- **Contemporâneo (2026):** marfim, moldura editorial e chamadas compactas.

Trocar o modelo mantém os textos, as imagens e a ordem das seções. Fundo
(papel marfim, claro ou grafite) e moldura (dupla, fina ou ausente) são independentes.

## Como montar uma edição

1. Preencha título, assunto do e-mail, publicação e, opcionalmente, capa.
2. Escolha o modelo e personalize nome do boletim, período e texto de abertura.
3. Adicione seções como Agenda, Aconteceu, Publicações ou Retrospectiva.
4. Use **Matérias** para textos com imagem ou **Chamadas** para listas de eventos,
   prazos e oportunidades. Cada conteúdo aceita título, texto, data/local/prazo
   e um botão de link opcional.
5. Reordene seções e conteúdos com as setas. Imagens podem ser selecionadas e
   recortadas ou informadas por URL. Endereços HTTP/HTTPS no texto viram links.
6. Use **Prévia**, ao lado de Salvar. A prévia aceita conteúdo incompleto e a capa
   local, sem cadastrar ou enviar a edição.

O formulário conserva a estrutura em `contentData`. O HTML persistido é gerado
no servidor com a URL definitiva da capa; atualizar a capa regenera o documento.
O conteúdo usa tabelas e estilos inline como base para e-mail; fundos e sombras
são melhorias visuais que podem variar conforme o leitor de e-mail.

## PDF automático e anexo

Ao salvar, a API usa esse mesmo HTML para gerar um PDF A4 com Chrome/Puppeteer,
incluindo cores, imagens e moldura. O formulário não solicita uma URL de PDF.
O arquivo e o hash do HTML de origem são guardados no banco na mesma gravação.
Se a geração falhar, a edição anterior permanece salva e o formulário pode ser
reenviado. Atualizar a capa ou o conteúdo gera uma nova versão do PDF.

**Baixar PDF** fica junto às ações da edição no admin. O portal oferece o download
das edições publicadas. Rascunhos exigem uma sessão de administrador. Documentos
antigos são gerados a partir do HTML salvo no primeiro download ou envio.

Ao iniciar uma campanha, a fila guarda cópias do HTML e do PDF. O e-mail usa o
HTML no corpo e o PDF como anexo. Editar a newsletter depois não altera essas
cópias nem os registros de entrega da campanha.

Na capa, os formatos ficam em uma coluna à esquerda da prévia, com os dados
gerais à direita. Em telas pequenas, os controles se reorganizam para manter
o espaço da imagem.

## Código avançado e edições antigas

**Avançado · editar código HTML** abre o código gerado. Os campos visuais ficam
guardados. É possível retomar o código personalizado ou gerar um novo código
com a versão visual atual. `{{newsletterCover}}` representa a capa definitiva.

Edições antigas sem `contentData` abrem no modo avançado preservando seu HTML.
A passagem para o editor visual pede confirmação dentro do formulário.

## API e implantação

- Aplicar a migration `20261026190000_add_newsletter_content_data` com
  `npx prisma migrate deploy` e gerar o cliente Prisma.
- Aplicar também `20261026200000_add_newsletter_generated_pdf`.
- A API depende de `puppeteer`. A instalação padrão baixa o Chrome; é possível
  usar um executável existente com `NEWSLETTER_PDF_EXECUTABLE_PATH`. Se o download
  foi pulado no ambiente de implantação, executar `npx puppeteer browsers install chrome`.
- `POST /newsletter/preview`: renderização autenticada, sem persistência ou SMTP.
- `POST /newsletter/images`: upload autenticado de imagens recortadas JPEG/PNG/WebP
  de até 10 MB. Usa a pasta `leviata/images/newsletter/content/` no Cloudinary.
- `GET /newsletter/:id/pdf`: download do PDF gerado; arquivos binários não são
  incluídos nas respostas de cadastro e listagem. `pdfUrl` é informativa e gerada
  pela API; não faz parte dos campos aceitos no cadastro.
- Criar e atualizar aceitam `contentData` como objeto JSON ou campo JSON em
  multipart. O modo visual gera `htmlContent` automaticamente. O modo avançado
  conserva o código em `contentData.customHtml` e a estrutura visual no mesmo objeto.
- Uma edição visual precisa de ao menos um conteúdo com título ou texto.
- O envio continua separado: salvar e visualizar não iniciam uma campanha.

Validação: `npm run test:newsletter-composer`, `npm run test:newsletter-delivery`
e os testes de renderização/integração de newsletter na API.
