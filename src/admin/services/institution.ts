import { api } from "../../services/api";
import type { InstitutionResponseDto } from "../dtos/InstitutionResponseDto";
import type { CreateInstitutionDto } from "../dtos/institutions/CreateInstitutionRequestDto";
import type { UpdateInstitutionDto } from "../dtos/institutions/UpdateInstitutionRequestDto";
import type {
  AdminListQuery,
  PaginatedResponseDto,
} from "../dtos/PaginatedResponseDto";

export const institutionService = {
  getAll(signal?: AbortSignal) {
    return api.get<InstitutionResponseDto[]>("/institutions", { signal });
  },
  getPage(params: AdminListQuery = {}, signal?: AbortSignal) {
    return api.get<PaginatedResponseDto<InstitutionResponseDto>>(
      "/institutions/paginated",
      { params, signal },
    );
  },
  getById(id: string, signal?: AbortSignal) {
    return api.get<InstitutionResponseDto>(`/institutions/${id}`, { signal });
  },
  create(data: CreateInstitutionDto) {
    return api.post<InstitutionResponseDto>("/institutions", data);
  },
  updateById(id: string, data: UpdateInstitutionDto) {
    return api.patch<InstitutionResponseDto>(`/institutions/${id}`, data);
  },
  removeById(id: string) {
    return api.delete(`/institutions/${id}`);
  },
};
