import { api } from "../../services/api";
import type { SearchResponseDto } from "../dtos/research/SearchResponseDto";
import type { CreateSearchRequestDto } from "../dtos/research/CreateSearchRequestDto";
import type { ImageUploadResponseDto } from "../dtos/ImageUploadResponseDto";
import type { UpdateSearchRequestDto } from "../dtos/research/UpdateSearchRequestDto";

export const researchService = {
  create(data: CreateSearchRequestDto, cover?: File) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      if (typeof value === "boolean") {
        formData.append(key, String(value));
        return;
      }

      if (typeof value === "number") {
        formData.append(key, String(value));
        return;
      }

      formData.append(key, value);
    });

    if (cover) {
      formData.append("cover", cover);
    }

    return api.post<SearchResponseDto>("/research", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll() {
    return api.get<SearchResponseDto[]>("/research");
  },

  getById(id: string) {
    return api.get<SearchResponseDto>(`/research/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<SearchResponseDto>(`/research/slug/${slug}`);
  },

  updateById(id: string, data: UpdateSearchRequestDto) {
    return api.patch<SearchResponseDto>(`/research/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/research/${id}`);
  },

  updateBySlug(slug: string, data: UpdateSearchRequestDto) {
    return api.patch<SearchResponseDto>(`/research/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/research/slug/${slug}`);
  },

  updateCover(slug: string, cover: File) {
    const formData = new FormData();

    formData.append("cover", cover);

    return api.patch<ImageUploadResponseDto>(
      `/research/slug/${slug}/cover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  removeCover(slug: string) {
    return api.delete(`/research/slug/${slug}/cover`);
  },
};
