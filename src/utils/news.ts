import {
  NewsRelatedType,
  type TNewsRelatedType,
} from "../admin/types/TNewsRelatedType";

export function groupNewsByYear<T extends { date: string }>(news: T[]) {
  const years = new Map<number | null, T[]>();

  for (const item of news) {
    const date = new Date(item.date);
    const year = Number.isNaN(date.getTime()) ? null : date.getUTCFullYear();
    const items = years.get(year) ?? [];
    items.push(item);
    years.set(year, items);
  }

  return Array.from(years, ([year, items]) => ({
    year,
    items: items.sort(
      (left, right) =>
        new Date(right.date).getTime() - new Date(left.date).getTime(),
    ),
  })).sort((left, right) => {
    if (left.year === null) return 1;
    if (right.year === null) return -1;
    return right.year - left.year;
  });
}

export function newsRelatedPath(
  type?: TNewsRelatedType | null,
  identifier?: string | null,
) {
  if (
    !type ||
    !identifier ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      identifier,
    )
  )
    return null;
  const id = encodeURIComponent(identifier);
  switch (type) {
    case NewsRelatedType.BOARD:
      return `/agenda/bancas/${id}`;
    case NewsRelatedType.JURY:
      return `/atividades/juris-historicos/juris/${id}`;
    case NewsRelatedType.MEETING:
      return `/atividades/encontros-e-seminarios/encontro/${id}`;
    case NewsRelatedType.PRESENTED_WORK:
      return `/atividades/apresentacoes-trabalhos/${id}`;
    case NewsRelatedType.PUBLICATION:
      return `/publicacoes?publicacao=${id}`;
    case NewsRelatedType.RESEARCH:
      return `/atividades/pesquisas/${id}`;
    case NewsRelatedType.RESEARCH_INSTRUMENT:
      return `/instrumentos/registro/${id}`;
    case NewsRelatedType.THEMATIC:
      return `/grupo/linhas-tematicas/tematica/${id}`;
  }
}
