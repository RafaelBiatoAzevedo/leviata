import type { PresentedWorkResponseDto } from "../dtos/presentedWorks/PresentedWorkResponseDto";
import type { PresentedWorkFormData } from "../validations/presentedWork.schema";

export function mapPresentedWorkToForm(
  presentedWork: PresentedWorkResponseDto,
): PresentedWorkFormData {
  return {
    title: presentedWork.title,

    date: presentedWork.date,

    location: presentedWork.location ?? "",

    meetingId: presentedWork.meetingId ?? "",

    documentUrl: presentedWork.documentUrl ?? "",

    registrationUrl: presentedWork.registrationUrl ?? "",

    recordingUrl: presentedWork.recordingUrl ?? "",

    meetingUrl: presentedWork.meetingUrl ?? "",

    authors: presentedWork.authors.map((author) => author.id!),
  };
}
