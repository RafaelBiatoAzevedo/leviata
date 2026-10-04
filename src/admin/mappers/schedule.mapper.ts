import type { CreateScheduleRequestDto } from "../dtos/schedule/CreateScheduleRequestDto";
import type { ScheduleResponseDto } from "../dtos/schedule/ScheduleResponseDto";
import type { ScheduleFormData } from "../validations/schedule.schema";

function toLocalDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function mapScheduleToForm(
  schedule: ScheduleResponseDto,
): ScheduleFormData {
  return {
    title: schedule.title,
    subtitle: schedule.subtitle ?? "",
    description: schedule.description ?? "",
    date: toLocalDateTime(schedule.date),
    endDate: toLocalDateTime(schedule.endDate),
    location: schedule.location ?? "",
    externalUrl: schedule.externalUrl ?? "",
  };
}

export function mapScheduleToCreateDto(
  data: ScheduleFormData,
): CreateScheduleRequestDto {
  return {
    title: data.title.trim(),
    subtitle: data.subtitle.trim() || null,
    description: data.description.trim() || null,
    date: new Date(data.date).toISOString(),
    endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    location: data.location.trim() || null,
    externalUrl: data.externalUrl || null,
  };
}
