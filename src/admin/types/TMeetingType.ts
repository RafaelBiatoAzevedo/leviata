export const MeetingType = {
  SEMINAR: "SEMINAR",
  MEETING: "MEETING",
  DOCUMENTARY: "DOCUMENTARY",
} as const;

export type TMeetingType = (typeof MeetingType)[keyof typeof MeetingType];

export const meetingTypeLabels: Record<TMeetingType, string> = {
  SEMINAR: "Seminário",
  MEETING: "Encontro",
  DOCUMENTARY: "Mostra de documentários",
};
