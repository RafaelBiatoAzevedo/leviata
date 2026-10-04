import type {
  AdminListQuery,
  PaginatedResponseDto,
} from "../dtos/PaginatedResponseDto";
import { api } from "../../services/api";
import type { ThematicResponseDto } from "../dtos/thematics/ThematicResponseDto";
import type { CreateThematicRequestDto } from "../dtos/thematics/CreateThematicRequestDto";
import type { UpdateThematicRequestDto } from "../dtos/thematics/UpdateThematicRequestDto";

export const thematicsService = {
  create(data: CreateThematicRequestDto) {
    return api.post<ThematicResponseDto>("/thematics", data);
  },

  getPage(params: AdminListQuery = {}, signal?: AbortSignal) {
    return api.get<PaginatedResponseDto<ThematicResponseDto>>(
      "/thematics/paginated",
      { params, signal },
    );
  },

  getAll() {
    return api.get<ThematicResponseDto[]>("/thematics");
  },

  getById(id: string) {
    return api.get<ThematicResponseDto>(`/thematics/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<ThematicResponseDto>(`/thematics/slug/${slug}`);
  },

  updateById(id: string, data: UpdateThematicRequestDto) {
    return api.patch<ThematicResponseDto>(`/thematics/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/thematics/${id}`);
  },

  updateBySlug(slug: string, data: UpdateThematicRequestDto) {
    return api.patch<ThematicResponseDto>(`/thematics/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/thematics/slug/${slug}`);
  },
};
