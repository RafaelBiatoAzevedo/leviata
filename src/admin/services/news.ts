import { api } from "../../services/api";

import type { ImageUploadResponseDto } from "../dtos/ImageUploadResponseDto";
import type { CreateNewsRequestDto } from "../dtos/news/CreateNewsRequestDto";
import type { NewsResponseDto } from "../dtos/news/NewsResponseDto";
import type { UpdateNewsRequestDto } from "../dtos/news/UpdateNewsRequestDto";

export const newsService = {
  create(data: CreateNewsRequestDto, cover?: File) {
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

    return api.post<NewsResponseDto>("/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll() {
    return api.get<NewsResponseDto[]>("/news");
  },

  getById(id: string) {
    return api.get<NewsResponseDto>(`/news/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<NewsResponseDto>(`/news/slug/${slug}`);
  },

  updateById(id: string, data: UpdateNewsRequestDto) {
    return api.patch<NewsResponseDto>(`/news/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/news/${id}`);
  },

  updateBySlug(slug: string, data: UpdateNewsRequestDto) {
    return api.patch<NewsResponseDto>(`/news/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/news/slug/${slug}`);
  },

  updateCover(slug: string, cover: File) {
    const formData = new FormData();

    formData.append("cover", cover);

    return api.patch<ImageUploadResponseDto>(
      `/news/slug/${slug}/cover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  removeCover(slug: string) {
    return api.delete(`/news/slug/${slug}/cover`);
  },
};
