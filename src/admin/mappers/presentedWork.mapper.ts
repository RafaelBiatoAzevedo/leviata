import type { CreatePresentedWorkRequestDto } from "../dtos/presentedWorks/CreatePresentedWorksRequestDto";
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

export function mapPresentedWorkToCreateDto(
  data: PresentedWorkFormData,
): CreatePresentedWorkRequestDto {
  return {
    title: data.title,

    date: data.date,

    location: data.location || undefined,

    meetingId: data.meetingId || undefined,

    documentUrl: data.documentUrl || undefined,

    registrationUrl: data.registrationUrl || undefined,

    recordingUrl: data.recordingUrl || undefined,

    meetingUrl: data.meetingUrl || undefined,

    authors: data.authors,
  };
}
