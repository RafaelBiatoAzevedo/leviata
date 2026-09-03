import type { JuryResponseDto } from "../dtos/juries/JuryResponseDto";

import type { JuryFormData } from "../validations/jury.schema";

export function mapJuryToForm(jury: JuryResponseDto): JuryFormData {
  return {
    title: jury.title,

    date: jury.date ? new Date(jury.date).toISOString().split("T")[0] : "",

    description: jury.description ?? "",

    location: jury.location ?? "",

    judges: jury.judges.map((judge) => judge.id!),

    jurors: jury.jurors.map((juror) => juror.id!),

    prosecutors: jury.prosecutors.map((prosecutor) => prosecutor.id!),

    defenders: jury.defenders.map((defender) => defender.id!),

    bailiffs: jury.bailiffs.map((bailiff) => bailiff.id!),

    documentUrl: jury.registrationUrl ?? "",

    registrationUrl: jury.registrationUrl ?? "",

    recordingUrl: jury.recordingUrl ?? "",

    meetingUrl: jury.meetingUrl ?? "",
  };
}
