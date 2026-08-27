import {
  MeetingType,
  meetingTypeLabels,
  type TMeetingType,
} from "../types/TMeetingType";

export const meetingTypeOptions = [
  ...(Object.values(MeetingType) as TMeetingType[]).map((category) => ({
    value: category,
    label: meetingTypeLabels[category],
  })),
];
