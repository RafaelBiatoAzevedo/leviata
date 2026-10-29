# LEVIATÃ E O CATIVEIRO — MISSÃO CODEX: ANALYTICS DO PORTAL

> **Modo de execução: criatividade máxima, engenharia responsável.**
> Este documento é um briefing de produto e implementação. Explore o repositório antes de decidir a arquitetura. Você tem autonomia para propor e construir a melhor experiência possível, sem quebrar o que já funciona.

## 1. Contexto do projeto

O **Leviatã e o Cativeiro** é um portal institucional de pesquisa histórica com frontend público e painel administrativo privado.

Arquitetura conhecida (confirme no código antes de modificar):
- Frontend: React + Vite + styled-components, publicado ou planejado para Vercel.
- Backend: NestJS + Prisma + PostgreSQL (Neon), com autenticação JWT.
- Mídias: Cloudinary (imagens e PDFs).
- Domínio: `leviataeocativeiro.com.br`, gerenciado pelo Registro.br, apontando para Vercel.
- Admin acessível por rota privada; no portal, a entrada para login é acionada por quatro cliques no logo.
- Conteúdo: pessoas, livros, artigos, instrumentos de pesquisa, pesquisas, bancas, júris, reuniões, trabalhos apresentados, vídeos, temáticas, notícias, newsletters e usuários do Admin.

**Objetivo:** disponibilizar dentro do Admin um módulo completo de análise de acessos ao portal público, com aparência profissional e informações úteis para os responsáveis pelo projeto.

## 2. Liberdade criativa — MÁXIMA

Atue como **product designer sênior + engenheiro full-stack sênior + especialista em visualização de dados**.

Você tem ampla liberdade para:
- Criar uma identidade visual elegante, sofisticada, memorável e coerente com o tema histórico/acadêmico do portal e o design existente.
- Definir layout, hierarquia, tipografia, gráficos, microinterações, animações discretas, skeleton loading, empty states e responsividade.
- Sugerir métricas úteis que não estejam explicitamente listadas.
- Escolher bibliotecas maduras e leves quando fizer sentido.
- Melhorar a usabilidade do Admin sem reescrever partes não relacionadas.
- Organizar o trabalho em etapas, executar a implementação e entregar um resultado utilizável.

**Criatividade máxima NÃO significa inventar dados, burlar limitações, gerar custos sem autorização ou enfraquecer segurança/privacidade.** Preserve os padrões existentes e privilegie simplicidade operacional.

## 3. Dashboard desejado

### Visão geral
- Visualizações de página no período.
- Visitas/sessões, quando o provedor permitir defini-las corretamente.
- Visitantes únicos estimados, com definição e limitações claras.
- Páginas por visita e tendência percentual comparada ao período anterior, se os dados sustentarem.
- Série temporal de acessos por dia, semana e mês.
- Filtros de período: hoje, 7 dias, 30 dias, 90 dias e intervalo personalizado, conforme disponibilidade real.

### Comportamento e conteúdo
- Ranking de páginas mais acessadas: Home, Publicações, Instrumentos de Pesquisa, Atividades, Agenda, Notícias, etc.
- Rotas e conteúdos populares (quando possível, sem registrar dados sensíveis em URLs).
- Origem do tráfego/referrers, países, dispositivos e navegadores, se o provedor disponibilizar.
- Indicadores comparativos e tendências.
- Exportação CSV, se viável.

### Experiência premium
- Gráficos interativos com tooltips e estados de carregamento.
- Dashboard responsivo para desktop, tablet e celular.
- Layout coerente com o menu e autenticação do Admin.
- Estados de erro, sem dados, indisponibilidade do provedor e limite de cota atingido.
- Acessibilidade, contraste, teclado, formatação de datas e números pt-BR.
- Atualização manual e cache com duração adequada.

### Online agora (opcional, etapa separada)
- Só apresentar usuários ativos em tempo real se houver infraestrutura e definição técnica adequadas (heartbeat/presença com expiração, por exemplo).
- Não rotular dados atrasados de analytics como “online agora”.
- Avaliar custo, privacidade e impacto antes de implementar.

## 4. Decisão de arquitetura: priorizar custo zero

**Não presumir que todo recurso da Vercel seja ilimitado ou gratuito.** Confirmar na documentação atual as cotas, retenção, disponibilidade da API, permissões, limitações do plano Hobby e elegibilidade de uso institucional/não comercial.

Avalie as alternativas:

1. **Vercel Web Analytics + API NestJS**: instrumentar o frontend e consultar estatísticas por backend protegido, caso a API, o plano e os termos de uso realmente permitam o caso. Nunca expor token privado no browser.
2. **Umami**: avaliar cloud versus self-hosted, custo real da hospedagem, limites e esforço de manutenção.
3. **Analytics próprio NestJS + Neon**: avaliar instrumentação mínima, retenção, agregações, índices, deduplicação, bots, custos de armazenamento e impactos no banco transacional.
4. Outra alternativa privacy-friendly, se demonstravelmente superior.

**Critérios, em ordem:** legalidade/adequação ao plano; custo operacional zero ou previsível; privacidade/LGPD; qualidade das métricas; manutenção simples; performance; integração; experiência visual.

Antes de implementar, documente a escolha em `docs/analytics-decision.md` (ou localização equivalente), incluindo trade-offs, requisitos e riscos. Se houver custo, necessidade de upgrade, conta externa ou credencial indisponível, **não contrate nem simule integração**: implemente a camada de abstração e a interface com estado “aguardando configuração”, e informe os passos necessários.

## 5. Diretrizes técnicas

### Frontend público
- Instrumentar navegações de SPA corretamente, evitando contagem duplicada por re-renderização.
- Não bloquear renderização nem degradar Core Web Vitals.
- Não rastrear a área administrativa por padrão.
- Respeitar requisitos de privacidade, cookies/consentimento quando aplicável, DNT/opt-out quando pertinente e política de privacidade.
- Evitar enviar nomes, e-mails, tokens, parâmetros sensíveis ou identificadores pessoais em eventos.

### Backend NestJS
- Criar módulo de analytics com controller, service, DTOs e adaptador/provider, respeitando a arquitetura existente.
- Rotas privadas autenticadas e autorizadas; confirmar roles/permissões já implementadas.
- Configuração via variáveis de ambiente com validação, nunca secrets no Git.
- Cache, timeouts, tratamento de rate limit, logs seguros e falhas do provedor.
- Agregações e intervalos consistentes com timezone `America/Sao_Paulo` ou convenção já usada pelo sistema.
- Respostas tipadas e validação dos filtros.
- Se usar Neon, migrations Prisma revisadas, índices apropriados e política de retenção.

### Admin React
- Criar página/rota `Analytics` ou `Estatísticas`, integrada ao menu existente.
- Usar os componentes, estilos, clientes HTTP e padrões de estado já presentes.
- Criar componentes reutilizáveis para cards, gráficos, tabelas e filtros.
- Nenhuma métrica fictícia em produção. Dados de demonstração apenas se claramente marcados e isolados do ambiente real.

## 6. Contrato de API sugerido (adaptável)

```text
GET /analytics/overview?from=YYYY-MM-DD&to=YYYY-MM-DD
GET /analytics/timeseries?from=YYYY-MM-DD&to=YYYY-MM-DD&granularity=day
GET /analytics/pages?from=YYYY-MM-DD&to=YYYY-MM-DD
GET /analytics/sources?from=YYYY-MM-DD&to=YYYY-MM-DD
GET /analytics/devices?from=YYYY-MM-DD&to=YYYY-MM-DD
GET /analytics/locations?from=YYYY-MM-DD&to=YYYY-MM-DD
```

Ajuste endpoints à disponibilidade real do provedor. Diferencie claramente **pageviews**, **visitas/sessões** e **visitantes únicos**; não apresente métricas estimadas como medições exatas.

## 7. Sequência de execução solicitada

1. **Inspecionar** frontend, Admin, API, autenticação, deploy e bibliotecas existentes.
2. **Pesquisar/verificar** documentação atual dos provedores e seus limites, sem assumir que o briefing está atualizado.
3. **Propor e registrar** a arquitetura escolhida e plano incremental.
4. **Implementar** instrumentação, integração, endpoints, tela Admin e estados de erro.
5. **Testar** navegação SPA, autenticação, filtros, responsividade, estados vazios e segurança.
6. **Validar** build, lint e testes disponíveis sem quebrar funcionalidades atuais.
7. **Entregar** resumo dos arquivos alterados, comandos executados, variáveis necessárias, passos de deploy e checklist de verificação em produção.

## 8. Critérios de aceite

- [ ] Página de analytics integrada ao Admin e protegida por autenticação/autorização.
- [ ] Instrumentação do portal público sem duplicação óbvia de pageviews.
- [ ] Dados reais quando configurados; estados claros quando não configurados.
- [ ] Gráficos e métricas consistentes com os dados disponíveis.
- [ ] Funciona bem em telas pequenas.
- [ ] Nenhum token sensível no frontend ou repositório.
- [ ] Sem custo pago ou contratação sem aprovação explícita.
- [ ] Sem regressões no portal, CMS, autenticação e deploy.
- [ ] Documentação de configuração e manutenção.

## 9. Restrições importantes

- Não modificar o fluxo de quatro cliques no logo sem necessidade.
- Não alterar estrutura de conteúdo, rotas públicas ou autenticação existentes sem justificativa.
- Não fazer migração destrutiva ou apagar dados.
- Não adicionar tracking invasivo ou identificação individual dos visitantes.
- Não afirmar que há dados históricos anteriores à ativação do tracking.
- Não confundir a Vercel Analytics com métricas em tempo real garantidas.
- Não realizar mudanças em produção, compras ou ativações pagas sem confirmação.

## 10. Mensagem final para o Codex

**Quero que você surpreenda no resultado visual e na qualidade de engenharia.** Não se limite a um painel básico de quatro números: crie uma central de inteligência de audiência com valor real para a equipe acadêmica. Você pode inovar bastante no design, nos insights e na apresentação dos dados, mas mantenha a solução sustentável, auditável, segura, privacy-first e preferencialmente gratuita. Analise o código real antes de agir; quando houver incerteza sobre serviço externo, escolha uma implementação que funcione de forma honesta sem dados inventados. Execute o máximo possível e me entregue instruções objetivas apenas para os passos que dependerem de mim.
