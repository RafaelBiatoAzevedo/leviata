import { api } from "../../services/api";
import type { ResearchInstrumentResponseDto } from "../dtos/researchInstruments/ResearchInstrumentResponseDto";
import type { CreateResearchInstrumentRequestDto } from "../dtos/researchInstruments/CreateResearchInstrumentRequestDto";
import type { ImageUploadResponseDto } from "../dtos/ImageUploadResponseDto";
import type { UpdateResearchInstrumentRequestDto } from "../dtos/researchInstruments/UpdateResearchInstrumentRequestDto";

export const researchInstrumentsService = {
  create(data: CreateResearchInstrumentRequestDto, cover?: File) {
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

    return api.post<ResearchInstrumentResponseDto>(
      "/researchInstruments",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  getAll() {
    return api.get<ResearchInstrumentResponseDto[]>("/researchInstruments");
  },

  getById(id: string) {
    return api.get<ResearchInstrumentResponseDto>(`/researchInstruments/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<ResearchInstrumentResponseDto>(
      `/researchInstruments/slug/${slug}`,
    );
  },

  updateById(id: string, data: UpdateResearchInstrumentRequestDto) {
    return api.patch<ResearchInstrumentResponseDto>(
      `/researchInstruments/${id}`,
      data,
    );
  },

  removeById(id: string) {
    return api.delete(`/researchInstruments/${id}`);
  },

  updateBySlug(slug: string, data: UpdateResearchInstrumentRequestDto) {
    return api.patch<ResearchInstrumentResponseDto>(
      `/researchInstruments/slug/${slug}`,
      data,
    );
  },

  removeBySlug(slug: string) {
    return api.delete(`/researchInstruments/slug/${slug}`);
  },

  updateCover(slug: string, cover: File) {
    const formData = new FormData();

    formData.append("cover", cover);

    return api.patch<ImageUploadResponseDto>(
      `/researchInstruments/slug/${slug}/cover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  removeCover(slug: string) {
    return api.delete(`/researchInstruments/slug/${slug}/cover`);
  },
};
