import { useState } from "react";
import type { AnalyticsData, AnalyticsRow } from "../../../analytics/types";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiCompass,
} from "react-icons/fi";
import { dateLabel, number } from "./utils";
import {
  Bar,
  Button,
  Empty,
  InsightList,
  Panel,
  PanelHeader,
  Ranking,
  RankTop,
  Search,
  Segments,
} from "./styles";

export function RankedRows({
  rows,
  total,
  paths = false,
  secondary = false,
}: {
  rows: AnalyticsRow[];
  total: number;
  paths?: boolean;
  secondary?: boolean;
}) {
  if (!rows.length)
    return <Empty>Nenhum acesso registrado neste recorte.</Empty>;
  return (
    <Ranking>
      {rows.map((row, index) => {
        const percent = total > 0 ? (row.views / total) * 100 : 0;
        return (
          <li key={row.key}>
            <RankTop>
              <div>
                <strong>
                  {paths && (
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")} ·{" "}
                    </span>
                  )}
                  {row.label}
                </strong>
                {paths && <small>{row.key}</small>}
              </div>
              <span>
                {number(row.views)}
                <small>{number(percent, 1)}%</small>
              </span>
            </RankTop>
            <Bar $percent={percent} $secondary={secondary} aria-hidden="true" />
          </li>
        );
      })}
    </Ranking>
  );
}

export function ContentRanking({ data }: { data: AnalyticsData }) {
  const [dimension, setDimension] = useState<"pages" | "sections">("pages");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const rows = data[dimension].filter((row) =>
    normalize(`${row.label} ${row.key}`).includes(normalize(query)),
  );
  return (
    <Panel>
      <PanelHeader>
        <div>
          <h2>Onde o conhecimento circula</h2>
          <p>Páginas e áreas com maior participação nos acessos.</p>
        </div>
      </PanelHeader>
      <Segments aria-label="Dimensão do ranking">
        <button
          type="button"
          aria-pressed={dimension === "pages"}
          onClick={() => {
            setDimension("pages");
            setExpanded(false);
          }}
        >
          Páginas
        </button>
        <button
          type="button"
          aria-pressed={dimension === "sections"}
          onClick={() => {
            setDimension("sections");
            setExpanded(false);
          }}
        >
          Áreas do portal
        </button>
      </Segments>
      <Search
        type="search"
        aria-label="Filtrar páginas e áreas"
        placeholder="Encontrar uma página ou área…"
        value={query}
        maxLength={100}
        onChange={(event) => setQuery(event.target.value)}
      />
      <RankedRows
        rows={expanded ? rows : rows.slice(0, 7)}
        total={data.pageviews}
        paths={dimension === "pages"}
      />
      {rows.length > 7 && (
        <Button
          style={{ marginTop: 20 }}
          type="button"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Mostrar menos" : `Ver todas (${number(rows.length)})`}
        </Button>
      )}
      {query && (
        <p
          role="status"
          style={{ marginTop: 12, fontSize: 11, color: "var(--muted)" }}
        >
          {number(rows.length)} resultados · percentuais sobre o total do
          período
        </p>
      )}
    </Panel>
  );
}

export function AudienceInsights({ data }: { data: AnalyticsData }) {
  const topSection = data.sections[0];
  const peak = data.series.reduce(
    (best, row) => (row.views > best.views ? row : best),
    data.series[0],
  );
  const mobile = data.devices.find((row) => row.key === "Celular");
  return (
    <Panel>
      <PanelHeader>
        <div>
          <h2>Leituras do período</h2>
          <p>Pistas para aproximar a pesquisa de mais leitores.</p>
        </div>
        <FiCompass aria-hidden="true" color="var(--gold)" size={21} />
      </PanelHeader>
      <InsightList>
        {data.pageviews > 0 && topSection ? (
          <>
            <article>
              <FiBookOpen aria-hidden="true" />
              <div>
                <h3>{topSection.label} em destaque</h3>
                <p>
                  A área reúne{" "}
                  {number((topSection.views / data.pageviews) * 100, 1)}% das
                  visualizações. Considere destacar conteúdos relacionados na
                  próxima divulgação.
                </p>
              </div>
            </article>
            <article>
              <FiCalendar aria-hidden="true" />
              <div>
                <h3>Maior circulação em {dateLabel(peak.date)}</h3>
                <p>
                  Foram {number(peak.views)} visualizações nesse dia. Compare a
                  data com publicações e atividades do grupo, sem presumir uma
                  relação de causa.
                </p>
              </div>
            </article>
            <article>
              <FiArrowUpRight aria-hidden="true" />
              <div>
                <h3>
                  {mobile && mobile.views / data.pageviews >= 0.5
                    ? "A leitura acontece no celular"
                    : "Acesso e legibilidade"}
                </h3>
                <p>
                  {mobile
                    ? `${number((mobile.views / data.pageviews) * 100, 1)}% das visualizações vieram de celulares. `
                    : "Ainda não há acessos classificados como celular. "}
                  Mantenha documentos, links e chamadas fáceis de consultar em
                  telas pequenas.
                </p>
              </div>
            </article>
          </>
        ) : (
          <article>
            <FiBookOpen aria-hidden="true" />
            <div>
              <h3>Cada acesso abre uma nova leitura</h3>
              <p>
                Os destaques serão calculados a partir das visualizações reais.
                Amplie o período ou aguarde os primeiros acessos.
              </p>
            </div>
          </article>
        )}
        <article>
          <FiCompass aria-hidden="true" />
          <div>
            <h3>Uma leitura cuidadosa dos números</h3>
            <p>
              Visualizações medem circulação de páginas. Elas não revelam
              quantas pessoas leram o conteúdo, nem medem o impacto acadêmico da
              pesquisa.
            </p>
          </div>
        </article>
      </InsightList>
    </Panel>
  );
}
