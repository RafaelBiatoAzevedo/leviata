import type { CreatePresentedWorkRequestDto } from "../dtos/presentedWorks/CreatePresentedWorksRequestDto";
import type { PresentedWorkResponseDto } from "../dtos/presentedWorks/PresentedWorkResponseDto";
import type { PresentedWorkFormData } from "../validations/presentedWork.schema";
import { toLocalDateTime } from "../utils/dateTime";

export function mapPresentedWorkToForm(
  presentedWork: PresentedWorkResponseDto,
): PresentedWorkFormData {
  return {
    title: presentedWork.title,

    date: toLocalDateTime(presentedWork.date),

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

    date: new Date(data.date).toISOString(),

    location: data.location || undefined,

    meetingId: data.meetingId || undefined,

    documentUrl: data.documentUrl?.trim() || null,

    registrationUrl: data.registrationUrl?.trim() || null,

    recordingUrl: data.recordingUrl?.trim() || null,

    meetingUrl: data.meetingUrl?.trim() || null,

    authors: data.authors,
  };
}
