import { api } from "../../services/api";
import type { VideoResponseDto } from "../dtos/videos/VideoResponseDto";
import type { CreateVideoRequestDto } from "../dtos/videos/CreateVideoRequestDto";
import type { UpdateVideoRequestDto } from "../dtos/videos/UpdateVideoRequestDto";

export const videosService = {
  create(data: CreateVideoRequestDto) {
    return api.post<VideoResponseDto>("/videos", data);
  },

  getAll() {
    return api.get<VideoResponseDto[]>("/videos");
  },

  getById(id: string) {
    return api.get<VideoResponseDto>(`/videos/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<VideoResponseDto>(`/videos/slug/${slug}`);
  },

  updateById(id: string, data: UpdateVideoRequestDto) {
    return api.patch<VideoResponseDto>(`/videos/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/videos/${id}`);
  },

  updateBySlug(slug: string, data: UpdateVideoRequestDto) {
    return api.patch<VideoResponseDto>(`/videos/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/videos/slug/${slug}`);
  },
};
