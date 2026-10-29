# Documentação dentro do admin

O menu **Documentação**, em `/admin/documentacao`, abre o manual HTML dentro do
layout administrativo. A rota usa o mesmo PrivateRoute do restante do admin.
O leitor permite busca, navegação pelo sumário, impressão, download do HTML e
abertura em nova aba. O iframe isola scripts do documento da sessão do admin.

O botão **Ver estrutura** abre a imagem atualizada do projeto em um diálogo
amplo, com ampliação, ajuste à tela, download e abertura em outra aba. O diálogo
mantém o foco, fecha com Escape e devolve o foco ao botão de abertura. A imagem
só é carregada quando o leitor é aberto, sem pesar no carregamento inicial.
Uma descrição textual da arquitetura acompanha a imagem.

A versão atual remove a faixa de fluxo de implantação e inclui Documentação
e Observatório/analytics próprio. A API permanece intermediando o acesso ao
Neon; o frontend não consulta o banco diretamente. A hospedagem da API não é
atribuída a um provedor sem confirmação da implantação.

O conjunto está em `public/documentacao`: HTML completo, cinco volumes Markdown,
leia-me, três diagramas SVG, inventário JSON, briefing de analytics e a imagem
`LEVIATA_ESTRUTURA_DO_PROJETO.png`. O Vite copia
esses arquivos para `dist/documentacao` automaticamente em `npm run build`.
Não é necessário copiar arquivos da pasta pai no deploy.

As referências de código do HTML indicam caminhos nos repositórios, apresentados
como texto; código-fonte e arquivos de ambiente não são publicados com o manual.
Links de download do próprio conjunto continuam relativos à pasta do HTML.
Atualize os arquivos em `public/documentacao` para publicar uma nova edição.

São arquivos estáticos da publicação: a rota do leitor exige login, mas o HTML
e seus anexos também podem ser abertos pela URL direta. Não inclua credenciais
ou informações privadas nesse conjunto. A documentação existente é um snapshot
da edição de 27/10/2026; os guias de evolução continuam em `docs/`.

Imagem atualizada em 29/10/2026 com a ferramenta integrada `image_gen`, a partir
do PNG original preservado na pasta LEVIATA. Os prompts usados estão em
`docs/structure-image-prompts.md`.
