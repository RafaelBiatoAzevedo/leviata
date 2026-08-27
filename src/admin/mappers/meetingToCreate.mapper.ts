import type { MeetingFormData } from "../validations/meeting.schem";

export function mapMeetingToCreateDto(data: MeetingFormData) {
  const dto = { ...data };

  delete (dto as Partial<MeetingFormData & { coverUrl: string }>).coverUrl;

  return dto;
}
