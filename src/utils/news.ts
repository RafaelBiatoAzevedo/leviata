import {
  NewsRelatedType,
  type TNewsRelatedType,
} from "../admin/types/TNewsRelatedType";

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
    case NewsRelatedType.PUBLICATION:
      return `/publicacoes?publicacao=${id}`;
    case NewsRelatedType.RESEARCH_INSTRUMENT:
      return `/instrumentos/registro/${id}`;
    case NewsRelatedType.THEMATIC:
      return `/grupo/linhas-tematicas/tematica/${id}`;
  }
}
