import type { MeetingResponseDto } from "../dtos/meetings/MeetingResponseDto";
import type { MeetingFormData } from "../validations/meeting.schem";

export function mapMeetingToForm(meeting: MeetingResponseDto): MeetingFormData {
  return {
    title: meeting.title,
    type: meeting.type,
    description: meeting.description ?? "",
    date: meeting.date ? new Date(meeting.date).toISOString().slice(0, 16) : "",
    location: meeting.location ?? "",
    registrationUrl: meeting.registrationUrl ?? "",
    meetingUrl: meeting.meetingUrl ?? "",
    speakers: meeting.speakers?.map((speaker) => speaker.id!) ?? [],
  };
}
