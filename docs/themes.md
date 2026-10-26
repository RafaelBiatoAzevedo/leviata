# Temas claro e escuro

O tema **claro é o padrão**, independentemente do tema do sistema operacional. O controle com sol/lua fica no cabeçalho do portal (desktop e celular) e do admin. A escolha explícita é salva na chave `portfolio-theme`, reaproveitada da estrutura que estava comentada no projeto.

`AppearanceProvider` centraliza a preferência e o `ThemeProvider` do styled-components. O estado é sincronizado entre abas. Valores desconhecidos ou armazenamento indisponível usam o claro; mesmo sem armazenamento, a troca funciona durante a navegação. O script inicial do HTML restaura uma preferência escura antes da primeira pintura para evitar um clarão branco ao recarregar.

## Preservação do claro

- Os valores originais de cores, fontes e breakpoints do claro estão registrados em `test/fixtures/light-theme.json`. Um teste compara os valores atuais com essa referência.
- `heading` tem o mesmo valor que `secondary` no claro; separa títulos de painéis escuros, que continuam usando `secondary` como fundo.
- `onPrimary` mantém o texto original dos botões no claro e garante contraste sobre o dourado no escuro.
- Cores que antes eram fixas agora usam variáveis CSS com o valor original como fallback. As variáveis `--theme-*` são definidas **somente no escuro**. O modo claro conserva o resultado visual dos valores anteriores.
- Imagens, PDFs e o conteúdo HTML próprio das newsletters não são invertidos. O tema adapta a interface ao redor deles.

## Cobertura

Portal, menus, cards, publicações, agendas, comentários, formulários, notificações, tabelas, editor de imagem e diálogos compartilham o tema. O escuro usa fundos em grafite, textos claros e os detalhes dourados existentes. Controles continuam acessíveis por teclado e possuem alvos de toque de pelo menos 44px onde já previsto. A troca respeita a preferência por movimento reduzido.

A limpeza de uma sessão expirada remove apenas os dados de autenticação, preservando o tema e o idioma salvos.

## Validação em 25/10/2026

```sh
npm run test:theme
npm run test:navigation
npm run build
```

Os 9 testes de tema passaram: preferência padrão, restauração, sincronização entre abas, armazenamento indisponível, inicialização do HTML, acessibilidade do controle, preservação da paleta clara, contraste no escuro, renderização nos dois temas e preservação da preferência ao expirar a sessão. Os 11 testes de navegação também passaram.

A execução das suítes do front separadas por arquivo teve 166 testes aprovados. Permanecem 4 falhas anteriores em `news-gallery-form.test.cjs`: o carregador CommonJS tenta executar `import.meta.env` sem mock. Os logs têm o mesmo erro anterior à implementação do tema.

O build e o lint dos arquivos de implementação alterados passaram. A conferência visual no navegador ficou pendente porque esta sessão não disponibiliza um navegador de automação.
