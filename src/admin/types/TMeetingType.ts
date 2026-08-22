export const MeetingType = {
  SEMINAR: "SEMINAR",
  MEETING: "MEETING",
} as const;

export type TMeetingType = (typeof MeetingType)[keyof typeof MeetingType];

export const meetingTypeLabels: Record<TMeetingType, string> = {
  SEMINAR: "Seminário",
  MEETING: "Reunião",
};
