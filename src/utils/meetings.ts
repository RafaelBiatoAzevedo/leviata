import type { TMeetingType } from "../admin/types/TMeetingType";

const activityPaths: Record<TMeetingType, string> = {
  MEETING: "/atividades/encontros",
  SEMINAR: "/atividades/seminarios",
  DOCUMENTARY: "/atividades/mostra-de-documentarios",
};

export function meetingDetailPath(type: TMeetingType, identifier: string) {
  return `${activityPaths[type]}/${encodeURIComponent(identifier)}`;
}
