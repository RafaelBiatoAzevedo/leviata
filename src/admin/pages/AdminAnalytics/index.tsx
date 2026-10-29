import { useState } from "react";
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiDownload,
  FiEye,
  FiGlobe,
  FiInfo,
  FiLock,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { AudienceChart } from "./AudienceChart";
import { AudienceInsights, ContentRanking, RankedRows } from "./Rankings";
import { useAnalytics } from "./useAnalytics";
import {
  dateLabel,
  downloadCsv,
  number,
  period,
  shiftDay,
  todayInSaoPaulo,
  validateRange,
} from "./utils";
import * as S from "./styles";

const statusLabels = {
  ready: "Dados de acessos disponíveis",
  not_configured: "Aguardando configuração",
  unavailable: "Coleta indisponível",
  quota_reached: "Cota mensal atingida",
};

export function AdminAnalytics() {
  const [range, setRange] = useState(() => period(30));
  const [preset, setPreset] = useState("30");
  const [draft, setDraft] = useState(range);
  const [rangeError, setRangeError] = useState<string | null>(null);
  const { report, error, loading, refresh } = useAnalytics(range);
  const data = report?.data;
  const today = todayInSaoPaulo();
  const change = data?.changePercent;
  const ready = report?.status === "ready";
  const selectPeriod = (value: string) => {
    setPreset(value);
    setRangeError(null);
    if (value !== "custom") {
      const next = period(Number(value));
      setRange(next);
      setDraft(next);
    }
  };
  return (
    <S.Container>
      <S.Header>
        <div>
          <S.Eyebrow>
            <FiGlobe aria-hidden="true" /> Inteligência de audiência
          </S.Eyebrow>
          <h1>Observatório</h1>
          <p>Entenda como a pesquisa encontra seus leitores.</p>
        </div>
        <S.Actions>
          <S.Button type="button" onClick={refresh} disabled={loading}>
            <FiRefreshCw aria-hidden="true" />
            Atualizar
          </S.Button>
          <S.Button
            type="button"
            $primary
            disabled={!data || loading}
            onClick={() => report && downloadCsv(report)}
          >
            <FiDownload aria-hidden="true" />
            Exportar CSV
          </S.Button>
        </S.Actions>
      </S.Header>

      <S.Hero>
        <div>
          <S.Status $ready={ready}>
            {loading
              ? "Consultando estatísticas"
              : error
                ? "Conexão indisponível"
                : report
                  ? statusLabels[report.status]
                  : "Estatísticas de acesso"}
          </S.Status>
          <h2>
            Conhecimento que circula.
            <br />
            <em>Histórias que alcançam.</em>
          </h2>
          <p>
            Um olhar sobre a presença pública do Leviatã e o Cativeiro: o que
            desperta interesse, de onde chegam os acessos e como eles evoluem.
          </p>
        </div>
        <S.HeroNumber>
          <span>Circulação no período</span>
          <strong>{data ? number(data.pageviews) : "—"}</strong>
          <small>visualizações de páginas públicas</small>
          <small>
            {dateLabel(range.from)} — {dateLabel(range.to)}
          </small>
        </S.HeroNumber>
      </S.Hero>

      <S.FilterBar>
        <S.Segments aria-label="Período das estatísticas">
          {[
            ["1", "Hoje"],
            ["7", "7 dias"],
            ["30", "30 dias"],
            ["90", "90 dias"],
            ["custom", "Personalizado"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={preset === value}
              onClick={() => selectPeriod(value)}
            >
              {label}
            </button>
          ))}
        </S.Segments>
        <span>
          <FiCalendar aria-hidden="true" />
          Horário de São Paulo · dados por dia
        </span>
      </S.FilterBar>
      {preset === "custom" && (
        <S.CustomRange
          onSubmit={(event) => {
            event.preventDefault();
            const message = validateRange(draft.from, draft.to);
            setRangeError(message);
            if (!message) setRange({ ...draft });
          }}
        >
          <label>
            De
            <input
              aria-describedby={
                rangeError ? "analytics-range-error" : undefined
              }
              aria-invalid={!!rangeError}
              type="date"
              required
              min={shiftDay(today, -179)}
              max={today}
              value={draft.from}
              onChange={(event) =>
                setDraft((value) => ({ ...value, from: event.target.value }))
              }
            />
          </label>
          <label>
            Até
            <input
              aria-describedby={
                rangeError ? "analytics-range-error" : undefined
              }
              aria-invalid={!!rangeError}
              type="date"
              required
              min={shiftDay(today, -179)}
              max={today}
              value={draft.to}
              onChange={(event) =>
                setDraft((value) => ({ ...value, to: event.target.value }))
              }
            />
          </label>
          <S.Button type="submit" $primary>
            Aplicar período
          </S.Button>
          {rangeError && (
            <p id="analytics-range-error" role="alert">
              {rangeError}
            </p>
          )}
        </S.CustomRange>
      )}

      {loading && (
        <div role="status" aria-live="polite" aria-busy="true">
          <p style={{ color: "var(--muted)", marginBottom: 15 }}>
            Carregando estatísticas de acesso…
          </p>
          <S.Metrics>
            {[0, 1, 2, 3].map((index) => (
              <S.Skeleton key={index} $height={153} />
            ))}
          </S.Metrics>
          <S.Skeleton style={{ marginTop: 22 }} $height={320} />
        </div>
      )}
      {error && (
        <S.State role="alert">
          <FiActivity aria-hidden="true" />
          <h2>Vamos recuperar a conexão</h2>
          <p>{error}</p>
          <S.Button type="button" onClick={refresh}>
            Tentar novamente
          </S.Button>
        </S.State>
      )}
      {report?.status === "not_configured" && (
        <S.State role="status">
          <FiBarChart2 aria-hidden="true" />
          <S.Eyebrow>Pronto para os primeiros acessos</S.Eyebrow>
          <h2>A próxima história começa com dados reais.</h2>
          <p>
            O Observatório está preparado. A coleta ainda precisa ser
            configurada e ativada no portal e no servidor, conforme o guia de
            implantação. Os gráficos serão preenchidos a partir dessa ativação.
          </p>
          <p>
            Não há histórico anterior à coleta. Nenhuma integração paga é
            necessária para esta solução.
          </p>
          <S.Button type="button" onClick={refresh}>
            <FiRefreshCw aria-hidden="true" />
            Verificar configuração
          </S.Button>
        </S.State>
      )}
      {report?.status === "unavailable" && (
        <S.State role="alert">
          <FiActivity aria-hidden="true" />
          <h2>Estatísticas temporariamente indisponíveis</h2>
          <p>
            A conexão com o armazenamento não respondeu. O portal continua
            disponível. Confira a implantação do módulo e tente novamente em
            alguns instantes.
          </p>
          <S.Button type="button" onClick={refresh}>
            Tentar novamente
          </S.Button>
        </S.State>
      )}

      {data && report && (
        <>
          {report.status === "quota_reached" && (
            <S.Notice role="status">
              <FiInfo aria-hidden="true" />
              <div>
                <strong>A coleta alcançou o limite mensal.</strong>
                <p>
                  Os dados existentes continuam disponíveis. Novos acessos serão
                  contabilizados no próximo mês; os períodos afetados têm
                  cobertura incompleta.
                </p>
              </div>
            </S.Notice>
          )}
          {import.meta.env.VITE_ANALYTICS_ENABLED !== "true" && (
            <S.Notice role="status">
              <FiInfo aria-hidden="true" />
              <div>
                <strong>
                  A instrumentação está desativada nesta publicação do portal.
                </strong>
                <p>
                  A coleta no frontend precisa ser habilitada na implantação
                  para que novos acessos apareçam.
                </p>
              </div>
            </S.Notice>
          )}
          <S.Metrics>
            <S.Metric>
              <div>
                Visualizações
                <FiEye aria-hidden="true" />
              </div>
              <strong>{number(data.pageviews)}</strong>
              <small>
                {change !== null && change !== undefined
                  ? `${change >= 0 ? "+" : ""}${number(change, 1)}% em relação ao período anterior`
                  : "Cada página vista conta um acesso; releituras também contam."}
              </small>
            </S.Metric>
            <S.Metric>
              <div>
                Média diária
                <FiTrendingUp aria-hidden="true" />
              </div>
              <strong>{number(data.averagePerDay, 1)}</strong>
              <small>
                Visualizações ÷ {number(report.range.days)}{" "}
                {report.range.days === 1
                  ? "dia selecionado"
                  : "dias selecionados"}
                , incluindo dias sem acesso.
              </small>
            </S.Metric>
            <S.Metric>
              <div>
                Dias com circulação
                <FiCalendar aria-hidden="true" />
              </div>
              <strong>
                {number(data.activeDays)}
                <span
                  style={{
                    fontSize: 15,
                    color: "var(--muted)",
                    fontWeight: 400,
                  }}
                >
                  {" "}
                  / {number(report.range.days)}
                </span>
              </strong>
              <small>Dias com pelo menos uma visualização registrada.</small>
            </S.Metric>
            <S.Metric>
              <div>
                Áreas alcançadas
                <FiGlobe aria-hidden="true" />
              </div>
              <strong>{number(data.sections.length)}</strong>
              <small>
                {data.sections[0]
                  ? `Maior circulação: ${data.sections[0].label}.`
                  : "As áreas aparecem conforme recebem acessos."}
              </small>
            </S.Metric>
          </S.Metrics>
          {!data.comparisonReliable && (
            <S.Notice>
              <FiInfo aria-hidden="true" />
              <div>
                <strong>
                  Leia este período como um recorte de circulação.
                </strong>
                <p>
                  O dia atual é parcial. Comparações percentuais exigem dois
                  períodos completos, posteriores ao início da coleta, dentro da
                  retenção e sem limite de cota atingido. Dias anteriores ao
                  primeiro registro não indicam ausência de audiência.
                </p>
              </div>
            </S.Notice>
          )}
          <AudienceChart data={data} />
          <S.Grid>
            <ContentRanking data={data} />
            <AudienceInsights data={data} />
          </S.Grid>
          <S.ThreeColumns>
            <S.Panel>
              <S.PanelHeader>
                <div>
                  <h2>Portas de entrada</h2>
                  <p>Origem do documento, por visualizações.</p>
                </div>
              </S.PanelHeader>
              <RankedRows
                rows={data.sources}
                total={data.pageviews}
                secondary
              />
            </S.Panel>
            <S.Panel>
              <S.PanelHeader>
                <div>
                  <h2>Telas de leitura</h2>
                  <p>Tipo de dispositivo declarado pelo navegador.</p>
                </div>
              </S.PanelHeader>
              <RankedRows rows={data.devices} total={data.pageviews} />
            </S.Panel>
            <S.Panel>
              <S.PanelHeader>
                <div>
                  <h2>Navegadores</h2>
                  <p>Famílias de navegador, sem versões.</p>
                </div>
              </S.PanelHeader>
              <RankedRows
                rows={data.browsers}
                total={data.pageviews}
                secondary
              />
            </S.Panel>
          </S.ThreeColumns>
          {report.earliestAvailableDate && (
            <S.Notice>
              <FiCalendar aria-hidden="true" />
              <div>
                Primeiro dia com dados atualmente retidos:{" "}
                <strong style={{ display: "inline" }}>
                  {dateLabel(report.earliestAvailableDate, true)}
                </strong>
                .{" "}
                {report.limitedMonths.length > 0 &&
                  `Meses com cota atingida: ${report.limitedMonths.join(", ")}. `}
                Não há reconstrução de acessos anteriores à ativação.
              </div>
            </S.Notice>
          )}
        </>
      )}

      <S.Methodology>
        <summary>Como ler os dados · metodologia e privacidade</summary>
        <dl>
          <div>
            <dt>Visualizações, pessoas e sessões</dt>
            <dd>
              Uma visualização é uma navegação visível para uma página pública,
              após uma breve espera. Recarregar ou voltar à página pode gerar
              outro acesso. Sessões, visitantes únicos e páginas por sessão não
              são medidos: não criamos identificadores de visitantes.
            </dd>
          </div>
          <div>
            <dt>O que o Observatório preserva</dt>
            <dd>
              Não guardamos IPs, User-Agents completos, nomes, e-mails,
              parâmetros de busca ou fragmentos. Páginas de conteúdo são
              agrupadas por modelo de rota, sem slugs. Países e presença online
              não são coletados.
            </dd>
          </div>
          <div>
            <dt>Períodos e comparações</dt>
            <dd>
              Dias seguem America/Sao_Paulo. Você pode consultar até 90 dias
              dentro da retenção de 180 dias. Semanas são blocos de sete dias
              dentro do filtro; meses seguem o calendário. O período anterior
              tem a mesma duração. O dia atual e o primeiro dia de coleta podem
              estar incompletos.
            </dd>
          </div>
          <div>
            <dt>Limites da medição</dt>
            <dd>
              DNT, GPC, opt-out, bloqueadores, JavaScript desativado e filtros
              de bots reduzem a coleta. Origem direta também inclui referências
              não informadas; a origem do documento acompanha navegações SPA.
              Dados ficam em cache por até cinco minutos, inclusive na
              atualização manual.
            </dd>
          </div>
        </dl>
      </S.Methodology>
      <S.Footer>
        <span>
          <FiShield aria-hidden="true" /> Estatísticas anônimas · acesso
          restrito ao admin
        </span>
        {report?.quota && (
          <span>
            {number(report.quota.used)} / {number(report.quota.limit)} eventos
            no mês · retenção de {report.retentionDays} dias
          </span>
        )}
        <span>
          <FiLock aria-hidden="true" />{" "}
          {report
            ? `Consulta: ${new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" }).format(new Date(report.generatedAt))}`
            : "Sem dados disponíveis"}
        </span>
      </S.Footer>
    </S.Container>
  );
}
