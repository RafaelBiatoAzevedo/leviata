import type {
  AdminListQuery,
  PaginatedResponseDto,
} from "../dtos/PaginatedResponseDto";
import { api } from "../../services/api";
import type { CreateScheduleRequestDto } from "../dtos/schedule/CreateScheduleRequestDto";
import type { ScheduleQueryDto } from "../dtos/schedule/ScheduleQueryDto";
import type { ScheduleResponseDto } from "../dtos/schedule/ScheduleResponseDto";
import type { UpdateScheduleRequestDto } from "../dtos/schedule/UpdateScheduleRequestDto";

export const scheduleService = {
  create(data: CreateScheduleRequestDto) {
    return api.post<ScheduleResponseDto>("/schedule", data);
  },

  getPage(params: AdminListQuery = {}, signal?: AbortSignal) {
    return api.get<PaginatedResponseDto<ScheduleResponseDto>>(
      "/schedule/paginated",
      { params, signal },
    );
  },

  getAll(params: ScheduleQueryDto = {}) {
    return api.get<ScheduleResponseDto[]>("/schedule", { params });
  },

  getById(id: string) {
    return api.get<ScheduleResponseDto>(`/schedule/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<ScheduleResponseDto>(`/schedule/slug/${slug}`);
  },

  updateById(id: string, data: UpdateScheduleRequestDto) {
    return api.patch<ScheduleResponseDto>(`/schedule/${id}`, data);
  },

  updateBySlug(slug: string, data: UpdateScheduleRequestDto) {
    return api.patch<ScheduleResponseDto>(`/schedule/slug/${slug}`, data);
  },

  removeById(id: string) {
    return api.delete(`/schedule/${id}`);
  },

  removeBySlug(slug: string) {
    return api.delete(`/schedule/slug/${slug}`);
  },
};
