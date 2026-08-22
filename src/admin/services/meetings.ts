import { api } from "../../services/api";
import type { ImageUploadResponseDto } from "../dtos/ImageUploadResponseDto";
import type { CreateMeetingRequestDto } from "../dtos/meetings/CreateMeetingRequestDto";
import type { MeetingResponseDto } from "../dtos/meetings/MeetingResponseDto";
import type { UpdateMeetingRequestDto } from "../dtos/meetings/UpdateMeetingRequestDto";

export const meetingsService = {
  create(data: CreateMeetingRequestDto, cover?: File) {
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

    return api.post<MeetingResponseDto>("/meetings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll() {
    return api.get<MeetingResponseDto[]>("/meetings");
  },

  getById(id: string) {
    return api.get<MeetingResponseDto>(`/meetings/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<MeetingResponseDto>(`/meetings/slug/${slug}`);
  },

  updateById(id: string, data: UpdateMeetingRequestDto) {
    return api.patch<MeetingResponseDto>(`/meetings/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/meetings/${id}`);
  },

  updateBySlug(slug: string, data: UpdateMeetingRequestDto) {
    return api.patch<MeetingResponseDto>(`/meetings/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/meetings/slug/${slug}`);
  },

  updateCover(slug: string, cover: File) {
    const formData = new FormData();

    formData.append("cover", cover);

    return api.patch<ImageUploadResponseDto>(
      `/meetings/slug/${slug}/cover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  removeCover(slug: string) {
    return api.delete(`/meetings/slug/${slug}/cover`);
  },
};
