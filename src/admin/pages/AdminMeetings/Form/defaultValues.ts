import { MeetingType } from "../../../types/TMeetingType";

export const meetingDefaultValues = {
  title: "",
  type: MeetingType.MEETING,
  description: "",
  date: "",
  location: "",
  registrationUrl: "",
  recordingUrl: "",
  meetingUrl: "",
  speakers: [],
};
