import { api } from "../../services/api";
import type { CreatePresentedWorkRequestDto } from "../dtos/presentedWorks/CreatePresentedWorksRequestDto";
import type { PresentedWorkResponseDto } from "../dtos/presentedWorks/PresentedWorkResponseDto";

import type { UpdatePresentedWorkRequestDto } from "../dtos/presentedWorks/UpdatePresentedWorkRequestDto";

export const presentedWorksService = {
  create(data: CreatePresentedWorkRequestDto) {
    return api.post<PresentedWorkResponseDto>("/presented-works", data);
  },

  getAll() {
    return api.get<PresentedWorkResponseDto[]>("/presented-works");
  },

  getById(id: string) {
    return api.get<PresentedWorkResponseDto>(`/presented-works/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<PresentedWorkResponseDto>(`/presented-works/slug/${slug}`);
  },

  updateById(id: string, data: UpdatePresentedWorkRequestDto) {
    return api.patch<PresentedWorkResponseDto>(`/presented-works/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/presented-works/${id}`);
  },

  updateBySlug(slug: string, data: UpdatePresentedWorkRequestDto) {
    return api.patch<PresentedWorkResponseDto>(
      `/presented-works/slug/${slug}`,
      data,
    );
  },

  removeBySlug(slug: string) {
    return api.delete(`/presented-works/slug/${slug}`);
  },
};
