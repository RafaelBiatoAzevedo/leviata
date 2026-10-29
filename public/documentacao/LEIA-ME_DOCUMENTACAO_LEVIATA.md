# Documentação do Leviatã e o Cativeiro

**Edição de 27 de outubro de 2026 · Frontend e API · Português**

## Comece por aqui

Abra **[LEVIATA_DOCUMENTACAO_COMPLETA.html](LEVIATA_DOCUMENTACAO_COMPLETA.html)** para ler o conjunto completo com sumário lateral, busca sem acentos, tabelas, diagramas e opção de impressão. O HTML funciona sem conexão; apenas links para fornecedores externos precisam de internet. Os arquivos abaixo são versões editáveis em Markdown do mesmo conteúdo.

## Os cinco volumes

| Volume | Conteúdo | Para quem |
| --- | --- | --- |
| [01 — Tecnologias e arquitetura](LEVIATA_01_TECNOLOGIAS_E_ARQUITETURA.md) | Como as partes se conectam; finalidade de cada uma das 83 dependências diretas; versões e evidências de uso | Desenvolvimento, coordenação e manutenção |
| [02 — Manual funcional](LEVIATA_02_MANUAL_FUNCIONAL.md) | Portal, login, painel, todos os cadastros, comentários, notificações, newsletters, PDF e mapa de navegação | Equipe editorial e administradores |
| [03 — API e banco](LEVIATA_03_API_E_BANCO_DE_DADOS.md) | 213 operações HTTP, permissões, parâmetros, 102 classes DTO, 27 modelos, 12 enums e 38 migrations | Backend, integrações e suporte |
| [04 — Operação e manutenção](LEVIATA_04_OPERACAO_E_MANUTENCAO.md) | Instalação, ambiente, SMTP, Chrome, scripts, testes, implantação, backups e diagnóstico | Quem instala, publica e opera |
| [05 — Cobertura e rastreabilidade](LEVIATA_05_COBERTURA_E_RASTREABILIDADE.md) | Matriz funcional, módulos, testes, validações do front e catálogo dos 783 arquivos de fonte | Auditoria e evolução do projeto |

## Referências visuais e inventário

* [Estrutura atualizada do projeto](LEVIATA_ESTRUTURA_DO_PROJETO.png): portal, admin, API, banco, mídias, e-mails, Observatório e Documentação; versão de 29/10/2026, disponível também no botão **Ver estrutura** do admin.
* [Arquitetura](LEVIATA_DIAGRAMA_ARQUITETURA.svg): navegador, API, banco, mídias e envio.
* [Moderação](LEVIATA_DIAGRAMA_MODERACAO.svg): comentário pendente, revisão e publicação/recusa.
* [Newsletter](LEVIATA_DIAGRAMA_NEWSLETTER.svg): editor, HTML/PDF, campanha, SMTP e entrega.
* [Inventário JSON](LEVIATA_INVENTARIO_TECNICO.json): snapshot verificável com versões, contratos, fontes e hashes, sem dados do banco ou segredos de ambiente.

## O que significa cobertura completa nesta entrega

O inventário percorreu as duas aplicações e catalogou todas as dependências diretas declaradas, todas as declarações de rota React, operações de controllers, classes DTO e entidades/enums do schema encontrados. O manual explica os fluxos do produto e diferencia conteúdo público, administração e operações de suporte. Não é apenas uma cópia do README de template nem uma lista de bibliotecas.

Há 113 declarações React de rota, incluindo wrappers e índice. Isso não equivale a 113 telas diferentes. As tabelas mantêm os aliases e a indicação de layout. Os 82 arquivos de teste encontrados também não representam uma porcentagem de cobertura.

O snapshot inclui alterações locais ainda não commitadas, inclusive o login/sidebar e a geração de newsletters/PDF. Ele descreve a implementação encontrada, sem afirmar que já está publicada, que as chaves externas foram cadastradas ou que todos os testes passaram numa única suíte.

## Pontos operacionais que merecem leitura antes de publicar

O volume 04 registra diferenças reais do código: bootstrap da API que não escuta com NODE_ENV=production, entrypoint de produção divergente do build, exemplo antigo de variável do frontend e seed com credenciais fixas de desenvolvimento. O volume 03 explica que o HTML dos rascunhos de newsletter pode sair na listagem pública atual, mesmo com o PDF protegido. Esses pontos não foram alterados nesta entrega documental.

O conjunto não inclui senhas, chaves, tokens, exportação de pessoas/inscritos ou alteração no banco. Os diagramas foram desenhados a partir do código e não são capturas de um servidor publicado.

## Consulta rápida por necessidade

* **Cadastrar um jurado externo:** volume 02, Pessoas e Júris históricos.
* **Aprovar um comentário:** volume 02, Comentários e Notificações; requer SUPER_ADMIN.
* **Montar e enviar um boletim:** volume 02, Newsletter; volume 04 para as chaves e o worker.
* **Descobrir um endpoint ou campo:** volume 03 e busca do HTML.
* **Instalar o sistema em outra máquina:** volume 04, começando pelos pré-requisitos e pontos de produção.
* **Localizar o arquivo responsável:** volume 05 ou inventário JSON.

Para manter o conjunto, atualize o volume correspondente à mudança e confira a matriz de fontes. A versão publicada dos documentos está em `leviata/public/documentacao`, incluída automaticamente pelo Vite no build do frontend e acessível em Admin → Documentação. As referências a código no HTML indicam caminhos nos repositórios, sem publicar os arquivos de fonte.
