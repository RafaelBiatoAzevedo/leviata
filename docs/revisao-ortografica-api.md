# Revisão ortográfica dos dados da API

Data: 03/11/2026.

Foram conferidos 159 registros retornados pelas 14 coleções de conteúdo do portal, incluindo biografias, títulos, descrições, resumos, legendas e newsletters. A revisão preserva a redação original e limita as alterações a erros de digitação, acentuação, hifenização, abreviações e espaços. Grafias históricas, textos em outros idiomas e nomes sem confirmação foram preservados.

Plano: 58 correções pontuais, correspondentes a 59 ocorrências em 38 registros. As newsletters são atualizadas pelo editor da API para manter o conteúdo visual, o HTML e o PDF consistentes. Nenhum envio de newsletter foi solicitado.

Estado: todas as 43 operações foram concluídas e confirmadas por nova leitura pública da API. As 59 ocorrências foram corrigidas em 38 registros, incluindo nove newsletters. Os dois títulos foram corrigidos diretamente em seus campos de texto para preservar os endereços e as capas.

## Verificação

A comparação integral das respostas anteriores e posteriores das 14 coleções confirmou a preservação dos identificadores, slugs, URLs, capas, anexos vinculados, relações e demais campos. Nas nove newsletters corrigidas, o HTML mantém a mesma estrutura e os mesmos links, e seu texto corresponde exatamente às correções planejadas; as datas de publicação e de envio permanecem iguais. A API atualizou somente os metadados de edição e de geração dos PDFs necessários ao salvamento.

## Alterações

| Coleção / registro | Campo | Antes | Depois |
| --- | --- | --- | --- |
| articles / `24bcc018-5102-45e6-a734-7972c205d761` | summary | Ferrreira | Ferreira |
| articles / `24bcc018-5102-45e6-a734-7972c205d761` | summary | dimencionar | dimensionar |
| articles / `ccdc7ae1-8e10-49cf-b74a-43398a7037e8` | journal | Revista Agora | Revista Ágora |
| articles / `2a12cead-42cc-4fce-8ebd-7a86f7ff6a9e` | journal | Revista Agora | Revista Ágora |
| articles / `69e870a3-9f9c-4512-8f57-e6e00001e103` | journal | Revista Epigrafe | Revista Epígrafe |
| articles / `d3fe9151-a6bd-42dc-8830-d36afdc47ca8` | journal | Cience Nueva | Ciencia Nueva |
| articles / `3e9debbb-4df1-4fc4-b9aa-93b486041686` | journal | Revista Agora | Revista Ágora |
| books / `37e8b424-bca6-4db7-a513-c198d30161b1` | title | Europa y America | Europa y América |
| books / `d4815b63-3798-494f-94fa-c9851518788b` | description | negro.Grandioso | negro. Grandioso |
| books / `d4815b63-3798-494f-94fa-c9851518788b` | description | resistência.A | resistência. A |
| books / `d4815b63-3798-494f-94fa-c9851518788b` | description | espiritualidade.Que | espiritualidade. Que |
| books / `467b57bf-2e30-4197-b520-efc218693a7c` | description | 1830 a1888 | 1830 a 1888 |
| books / `c1e929c3-e43c-43da-8530-05c49318373d` | description | impressa local | imprensa local |
| books / `c1e929c3-e43c-43da-8530-05c49318373d` | publisher | Humanltas | Humanitas |
| books / `223f9ece-f340-4b56-830e-29562e253c09` | description | normatriva | normativa |
| books / `223f9ece-f340-4b56-830e-29562e253c09` | description | crmininal | criminal |
| juries / `cc7ba055-4c0d-426c-a756-85dd85d5169f` | images.c8b4ef55-a049-4afd-a808-86b7b5d1198a.title | Samuek Ribeiro | Samuel Ribeiro |
| juries / `eb297cd0-69fd-4849-9613-c9eccd97c22e` | location | FRanca | Franca |
| meetings / `8d96dc0a-fb4e-40b0-8a6f-cb0574633e69` | location | 16h ás 18h | 16h às 18h |
| meetings / `6f26283b-e85d-4987-a84b-721c5242082c` | description | Adriana Pereira campos | Adriana Pereira Campos |
| meetings / `6f26283b-e85d-4987-a84b-721c5242082c` | images.458e7d17-6822-4e9f-acf5-fd0d05495393.title | 33° | 33º |
| meetings / `6f26283b-e85d-4987-a84b-721c5242082c` | images.01890273-1896-4ed2-bfad-a1044d2bbd4b.title | Marília Tofanatto Alves | Marília Tofanetto Alves |
| meetings / `9b46c8cd-c015-4c70-a0ab-dc847336328b` | images.d821aa36-9338-47ee-9013-5ccc43946e27.title | Credencimento | Credenciamento |
| meetings / `9b46c8cd-c015-4c70-a0ab-dc847336328b` | images.bedbdd28-ac5d-4e37-a261-db6361c5f47c.description | Prof. Dr, | Prof. Dr. |
| meetings / `9b46c8cd-c015-4c70-a0ab-dc847336328b` | images.9ddf2dbd-8b7f-4a2a-bfdd-f4b57752bec8.title | Simpòsio | Simpósio |
| meetings / `9b46c8cd-c015-4c70-a0ab-dc847336328b` | images.0562cccc-32ff-497b-81ce-c3f76819ab82.title | Coffe Break | Coffee Break |
| news / `7dcb284e-dcff-4dd8-8c12-abc9646234bb` | images.c11f82af-b987-4f0c-99ef-c39ac41c264f.title | Mesa-redonsa | Mesa-redonda |
| newsletter / `f527dddb-63aa-458f-9c4b-57330b619694` | subject | Levitã | Leviatã |
| newsletter / `f527dddb-63aa-458f-9c4b-57330b619694` | contentData.sections.0.items.0.text | 2a edição | 2ª edição |
| newsletter / `f527dddb-63aa-458f-9c4b-57330b619694` | contentData.sections.0.items.1.text | 1a | 1ª |
| people / `3e93ad59-c3bc-49ff-8a4a-a3bdc2047b79` | bio | livre-Docente | livre-docente |
| people / `820a0ac4-0e4e-4288-86b7-45cd598a4389` | bio | vice coordenador | vice-coordenador |
| people / `e215b17f-8e46-4772-9e64-878d7244dd8a` | bio | Visitante Junior | Visitante Júnior |
| people / `8c67d9f4-2121-49c9-8932-44f71cf4821d` | bio | Lisboa(2000) | Lisboa (2000) |
| people / `8f48b984-f72f-4201-86a4-a0a02fa837fd` | bio | n2025/27274-0 | nº 2025/27274-0 |
| people / `b5b6ea35-e620-47d9-8aea-209e4279f8dd` | bio | Processual.Tem | Processual. Tem |
| people / `b5b6ea35-e620-47d9-8aea-209e4279f8dd` | bio | Identifcadores | Identificadores |
| people / `b5b6ea35-e620-47d9-8aea-209e4279f8dd` | bio | ReseardherID | ResearcherID |
| people / `bf28c8e5-9304-46f4-a9a3-ddcafc485542` | bio | Iniciação a Docência | Iniciação à Docência |
| people / `c3d4972a-5535-4cc9-8b5f-462c8a4c04de` | bio | luso brasileiras | luso-brasileiras |
| people / `e15feae2-d81c-44ff-9099-4bfa35d0bc3e` | bio | Livre docente | Livre-docente |
| people / `e15feae2-d81c-44ff-9099-4bfa35d0bc3e` | bio | Inter- unidades | Interunidades |
| presented-works / `00f104f9-2338-44bc-b0cb-a95cc269bb67` | title | manuai didáticos | manuais didáticos |
| presented-works / `927d8562-d552-429f-b1b7-03698c9114a4` | location | HistóriaBelo | História - Belo |
| research / `86cd9591-87f9-40ed-998c-69dcfcce8e1c` | supports.72f3ce94-8ccb-45b4-8cc5-23db126a47b5.description | n° | nº |
| newsletter / `13f70f5a-aaf2-498a-b5b3-f0dffffcb014` | contentData.sections.0.items.2.text | mundo luso atlântico | mundo luso-atlântico |
| newsletter / `13f70f5a-aaf2-498a-b5b3-f0dffffcb014` | contentData.sections.1.items.2.text | 33o Simpósio | 33º Simpósio |
| newsletter / `cdfaf88a-ddb2-4e70-8cdf-701fb50a11b8` | contentData.sections.1.items.1.text | Youtube | YouTube |
| newsletter / `4bc79801-ff98-4d7c-8527-5b857d513b76` | contentData.sections.0.items.0.text | Leviată | Leviatã |
| newsletter / `4bc79801-ff98-4d7c-8527-5b857d513b76` | contentData.sections.0.items.0.text | Lusobrasileiras | Luso-brasileiras |
| newsletter / `c827f3bf-6660-427d-b8d8-b1d0633fa793` | contentData.sections.0.items.0.text | instituição- ⏎ sede | instituição-sede |
| newsletter / `64732c9d-77b7-4dbc-ad67-e5d6e21c6757` | contentData.sections.0.items.0.text | mesa redonda | mesa-redonda |
| newsletter / `66126f9a-cea3-4eb8-9d75-2167c1b87f6c` | contentData.sections.2.items.0.text | Gabriel Ferreia Gurian | Gabriel Ferreira Gurian |
| newsletter / `66126f9a-cea3-4eb8-9d75-2167c1b87f6c` | contentData.sections.4.items.4.text | 5o Seminário | 5º Seminário |
| newsletter / `70abe9e2-a42e-47a3-9b4f-e64cafe4cf69` | contentData.sections.0.items.1.text | 33o. Simpósio | 33º Simpósio |
| newsletter / `026c320a-0c8f-4870-83c7-787db638eb65` | contentData.sections.0.items.0.text | 11° Encontro | 11º Encontro |
| newsletter / `026c320a-0c8f-4870-83c7-787db638eb65` | contentData.sections.0.items.0.title | 11° Encontro | 11º Encontro |
| newsletter / `026c320a-0c8f-4870-83c7-787db638eb65` | contentData.sections.0.items.1.text | 1a Fase | 1ª Fase |

## Conferências de grafias editoriais

- [Ciencia Nueva — página original do artigo na Universidad Tecnológica de Pereira](https://revistas.utp.edu.co/index.php/historia/article/view/25232).
- [Epígrafe — página original do artigo na USP](https://revistas.usp.br/epigrafe/article/view/235574).
- [Humanitas — apresentação do livro no Jornal da USP](https://jornal.usp.br/cultura/livro-mostra-a-resistencia-de-ex-escravos-no-rio-de-janeiro/).

As correções de nomes nas legendas e textos foram limitadas aos casos confirmados pelos participantes e autores vinculados aos próprios registros. Não foram alterados nomes no cadastro de pessoas.
