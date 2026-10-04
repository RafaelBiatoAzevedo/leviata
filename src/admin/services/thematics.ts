import type {
  AdminListQuery,
  PaginatedResponseDto,
} from "../dtos/PaginatedResponseDto";
import { api } from "../../services/api";
import type { ThematicResponseDto } from "../dtos/thematics/ThematicResponseDto";
import type { CreateThematicRequestDto } from "../dtos/thematics/CreateThematicRequestDto";
import type { UpdateThematicRequestDto } from "../dtos/thematics/UpdateThematicRequestDto";
import { loadAllPages } from "../../utils/loadAllPages";

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

  getAll(params: AdminListQuery = {}, signal?: AbortSignal) {
    return api.get<ThematicResponseDto[]>("/thematics", { params, signal });
  },

  getAllAvailable(signal?: AbortSignal) {
    return loadAllPages((params) => thematicsService.getAll(params, signal));
  },

  getDetails(identifier: string, signal?: AbortSignal) {
    const isId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier,
      );
    return api.get<ThematicResponseDto>(
      isId
        ? `/thematics/${encodeURIComponent(identifier)}`
        : `/thematics/slug/${encodeURIComponent(identifier)}`,
      { signal },
    );
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
