import type { JuryFormData } from "../../../validations/jury.schema";

export const juryDefaultValues: JuryFormData = {
  title: "",
  date: "",

  judges: [],
  jurors: [],
  prosecutors: [],
  defenders: [],
  bailiffs: [],

  registrationUrl: "",
  recordingUrl: "",
  meetingUrl: "",
};
