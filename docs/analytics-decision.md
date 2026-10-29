# Observatório — decisão de arquitetura

Decisão registrada em 28/10/2026, antes da implementação.

## Escolha

Analytics próprio, opcional, no NestJS/PostgreSQL já utilizados. Sem nova conta,
serviço pago, cookie, fingerprint ou identificador de visitante. A coleta vem
desativada nos dois projetos. Ativar somente depois de aplicar a migration,
conferir a capacidade da infraestrutura e atualizar o aviso de privacidade.

O provider fica atrás de uma interface para permitir substituição futura. A
primeira versão mede visualizações, evolução, páginas/seções, origem da entrada
no documento, dispositivos e famílias de navegadores. Rotas dinâmicas são
agrupadas por modelo (`:id`), sem enviar nomes ou slugs. Países, sessões,
visitantes únicos e páginas/sessão não são medidos. O painel explica a ausência;
nenhum desses valores é inferido a partir de pageviews. Não há presença online.

## Alternativas verificadas nas fontes oficiais

- [Vercel Web Analytics](https://vercel.com/docs/analytics/limits-and-pricing):
  Hobby inclui 50 mil eventos/mês e janela de consulta de um mês. A
  [API pública existe desde maio de 2026](https://vercel.com/changelog/web-analytics-api).
  Portanto, não se deve afirmar que a Vercel não tem API. Entretanto, faltam
  credenciais e confirmação da elegibilidade deste projeto institucional: o
  [Hobby é restrito a uso pessoal não comercial](https://vercel.com/docs/plans/hobby).
  Não ativar, contratar nem prometer integração com esse plano.
- [Umami Cloud](https://umami.is/pricing): Hobby gratuito oferece 100 mil
  eventos/mês, um site e seis meses de retenção, mas acesso à API aparece no
  Pro (US$ 20/mês). O painel incorporado não deve depender de API paga sem
  autorização. [Self-hosting](https://docs.umami.is/docs/install) oferece API,
  mas exige outra aplicação Node/PostgreSQL, atualizações e hospedagem.
- [Neon](https://neon.com/pricing): a página consultada informa 100 CU-h/mês
  por projeto e 1 GB de armazenamento no Free. Isso não confirma o plano nem
  a capacidade disponível desta conta. Coleta e consultas consomem recursos
  compartilhados com o CMS; não existe promessa de custo zero ilimitado.

As cotas podem mudar. Revalidar no deploy e monitorar o consumo no provedor.

## Proteções e limites planejados

- Tabela isolada sem relação com conteúdo/usuários; migration apenas aditiva.
- UUID por visualização, exclusivamente para deduplicação; nenhum ID de pessoa,
  sessão ou navegador. Armazenar somente dia em São Paulo e dimensões fechadas.
- Teto mensal atômico: 10 mil eventos por padrão, configurável até 100 mil.
  Ao atingir o teto, interromper gravações e sinalizar cobertura incompleta.
- Janela de consulta de 180 dias. Comparações só aparecem quando ambos os
  períodos estão integralmente disponíveis; um filtro de 90 dias pode não ter
  referência anterior completa, especialmente ao excluir o dia atual parcial.
  Exclusão limitada, oportunista, no recebimento de tráfego; sem cron acordando
  o Neon. Manutenção administrativa via comando documentado para portal inativo.
- Cache privado de cinco minutos, tamanho limitado, consultas com timeout;
  atualização manual respeita o cache para evitar sobrecarga.
- Allowlist exata de origens, exclusão do admin/rotas desconhecidas, bots
  conhecidos, DNT, GPC e opt-out. Rate limit em memória com chave efêmera
  derivada do endereço de rede; nenhum IP ou User-Agent bruto no banco/log.
- Filtros validados; intervalos de até 90 dias e somente dentro da retenção.
  Dias parciais, início da coleta e cotas limitam as comparações e são informados.
- JWT e AdminGuard existentes para leitura. Coletor público separado, sem
  credenciais; falhas nunca bloqueiam a navegação do portal.

## Trade-offs e riscos

Bloqueadores, JavaScript desativado, opt-out, navegações muito rápidas, bots não
reconhecidos e tráfego forjado afetam a medição. Origin e rate limit reduzem abuso,
mas não autenticam um visitante público. Rate limit local não é distribuído;
usar proteção de borda em instalações com várias réplicas. A cota de gravações
é compartilhada e atômica no banco, mesmo entre réplicas. A ausência de
identificação reduz a precisão disponível em ferramentas comerciais, em troca
de menor coleta e operação mais simples. Não é um sistema antifraude.

Sem afirmação automática de conformidade LGPD: responsáveis devem validar a
finalidade e a transparência, inclusive logs da infraestrutura, separadamente.
Histórico começa na ativação; não importar nem gerar eventos retrospectivos.

## Entrega incremental

1. Provider, migration, contratos, coleta e segurança no backend.
2. Instrumentação SPA e preferência de privacidade no portal.
3. Observatório abaixo de Dashboard: filtros, comparação, gráfico acessível,
   rankings, insights, exportação e estados de operação.
4. Testes, builds, lint e guia de operação. Deploy/ativação ficam fora desta tarefa.
