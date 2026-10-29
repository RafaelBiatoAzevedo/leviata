import { useId, useState } from "react";
import type { AnalyticsData } from "../../../analytics/types";
import { chartBuckets, dateLabel, number } from "./utils";
import type { Granularity } from "./utils";
import {
  ChartBox,
  ChartReadout,
  ChartLabels,
  ChartFooter,
  ChartAxis,
  Empty,
  Panel,
  PanelHeader,
} from "./styles";

export function AudienceChart({ data }: { data: AnalyticsData }) {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [selected, setSelected] = useState<number | null>(null);
  const [compare, setCompare] = useState(false);
  const gradient = useId().replace(/:/g, "");
  const points = chartBuckets(data.series, granularity);
  const active = Math.min(selected ?? points.length - 1, points.length - 1);
  const point = points[active];
  const comparing = compare && data.comparisonReliable;
  const maximum = Math.max(
    4,
    ...points.map((row) =>
      Math.max(row.views, comparing ? row.previousViews : 0),
    ),
  );
  const ceiling = Math.ceil(maximum / 4) * 4;
  const x = (i: number) =>
    points.length === 1 ? 520 : 50 + (i / (points.length - 1)) * 920;
  const y = (value: number) => 205 - (value / ceiling) * 180;
  const line = (previous = false) =>
    points
      .map(
        (row, i) =>
          `${i === 0 ? "M" : "L"}${x(i)},${y(previous ? row.previousViews : row.views)}`,
      )
      .join(" ");
  const periodLabel = point
    ? `${dateLabel(point.date)}${point.end !== point.date ? ` a ${dateLabel(point.end)}` : ""}`
    : "";
  return (
    <Panel aria-label="Evolução das visualizações">
      <PanelHeader>
        <div>
          <h2>O alcance ao longo do tempo</h2>
          <p>Visualizações de página no período selecionado.</p>
        </div>
        <select
          aria-label="Agrupar gráfico por"
          value={granularity}
          onChange={(event) => {
            setGranularity(event.target.value as Granularity);
            setSelected(null);
          }}
        >
          <option value="day">Dia</option>
          <option value="week">Semana · blocos de 7 dias</option>
          <option value="month">Mês</option>
        </select>
      </PanelHeader>
      {data.pageviews === 0 ? (
        <Empty>
          Ainda não há visualizações neste período. Os primeiros acessos
          aparecerão aqui após a ativação da coleta.
        </Empty>
      ) : (
        <ChartBox>
          <ChartReadout aria-live="polite" aria-atomic="true">
            <span>{periodLabel}</span>
            <strong>{number(point.views)}</strong>
            <span>visualizações</span>
            {comparing && (
              <span>· {number(point.previousViews)} no período anterior</span>
            )}
          </ChartReadout>
          <div
            role="slider"
            tabIndex={0}
            aria-label="Explorar evolução de acessos. Use as setas para percorrer o gráfico."
            aria-valuemin={0}
            aria-valuemax={points.length - 1}
            aria-valuenow={active}
            aria-valuetext={`${periodLabel}: ${number(point.views)} visualizações`}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight" || event.key === "ArrowUp"
                  ? active + 1
                  : event.key === "ArrowLeft" || event.key === "ArrowDown"
                    ? active - 1
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? points.length - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                setSelected(Math.max(0, Math.min(points.length - 1, next)));
              }
            }}
          >
            <ChartAxis aria-hidden="true">
              {[0, 1, 2, 3, 4].map((tick) => (
                <span
                  key={tick}
                  style={{ top: `${(y((ceiling / 4) * tick) / 230) * 100}%` }}
                >
                  {number((ceiling / 4) * tick)}
                </span>
              ))}
            </ChartAxis>
            <svg
              viewBox="0 0 1000 230"
              preserveAspectRatio="none"
              aria-hidden="true"
              onPointerMove={(event) => {
                const box = event.currentTarget.getBoundingClientRect();
                setSelected(
                  Math.max(
                    0,
                    Math.min(
                      points.length - 1,
                      Math.round(
                        ((((event.clientX - box.left) / box.width) * 1000 -
                          50) /
                          920) *
                          (points.length - 1),
                      ),
                    ),
                  ),
                );
              }}
            >
              <defs>
                <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C6A15B" stopOpacity=".25" />
                  <stop offset="100%" stopColor="#C6A15B" stopOpacity=".01" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((tick) => (
                <g key={tick}>
                  <line
                    x1="50"
                    x2="970"
                    y1={y((ceiling / 4) * tick)}
                    y2={y((ceiling / 4) * tick)}
                    stroke="var(--line)"
                    strokeDasharray="4 5"
                  />
                </g>
              ))}
              <path
                d={`${line()} L${x(points.length - 1)},205 L${x(0)},205 Z`}
                fill={`url(#${gradient})`}
              />
              {comparing && (
                <path
                  d={line(true)}
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              <path
                d={line()}
                fill="none"
                stroke="var(--gold)"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
              />
              <line
                x1={x(active)}
                x2={x(active)}
                y1="20"
                y2="205"
                stroke="var(--gold)"
                strokeOpacity=".35"
                strokeDasharray="4 4"
              />
              <circle
                cx={x(active)}
                cy={y(point.views)}
                r="5"
                fill="var(--gold)"
                stroke="var(--line)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <ChartLabels>
            <span>{dateLabel(points[0].date)}</span>
            {points.length > 2 && (
              <span>
                {dateLabel(points[Math.floor(points.length / 2)].date)}
              </span>
            )}
            <span>{dateLabel(points[points.length - 1].end)}</span>
          </ChartLabels>
        </ChartBox>
      )}
      <ChartFooter>
        <label
          title={
            !data.comparisonReliable
              ? "Comparação disponível quando há dois períodos completos de coleta, sem cotas atingidas."
              : undefined
          }
        >
          <input
            type="checkbox"
            checked={comparing}
            disabled={!data.comparisonReliable}
            onChange={(event) => setCompare(event.target.checked)}
          />
          Comparar com período anterior
        </label>
        <span>
          {data.comparisonReliable
            ? "Períodos de mesma duração"
            : "Comparação depende de dois períodos completos"}
        </span>
      </ChartFooter>
    </Panel>
  );
}
