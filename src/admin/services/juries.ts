import { api } from "../../services/api";
import type { JuryResponseDto } from "../dtos/juries/JuryResponseDto";
import type { CreateJuryRequestDto } from "../dtos/juries/CreateJuryRequestDto";
import type { UpdateJuryRequestDto } from "../dtos/juries/UpdateJuryRequestDto";
import type { ImageUploadResponseDto } from "../dtos/ImageUploadResponseDto";

export const juriesService = {
  create(data: CreateJuryRequestDto, cover?: File) {
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

    return api.post<JuryResponseDto>("/juries", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll() {
    return api.get<JuryResponseDto[]>("/juries");
  },

  getById(id: string) {
    return api.get<JuryResponseDto>(`/juries/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<JuryResponseDto>(`/juries/slug/${slug}`);
  },

  updateById(id: string, data: UpdateJuryRequestDto) {
    return api.patch<JuryResponseDto>(`/juries/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/juries/${id}`);
  },

  updateBySlug(slug: string, data: UpdateJuryRequestDto) {
    return api.patch<JuryResponseDto>(`/juries/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/juries/slug/${slug}`);
  },

  updateCover(slug: string, cover: File) {
    const formData = new FormData();

    formData.append("cover", cover);

    return api.patch<ImageUploadResponseDto>(
      `/juries/slug/${slug}/cover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  removeCover(slug: string) {
    return api.delete(`/juries/slug/${slug}/cover`);
  },
};
