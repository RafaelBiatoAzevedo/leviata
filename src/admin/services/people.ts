import type { CreatePersonDto } from "../dto/people/CreatePersonRequestDto";
import type { PersonResponseDto } from "../dto/people/PersonResponseDto";
import type { UpdatePersonDto } from "../dto/people/UpdatePersonRequestDto";
import { api } from "../../services/api";
import type { ImagePersonResponseDto } from "../dto/people/ImagePersonResponseDto";

export const peopleService = {
  create(data: CreatePersonDto, image?: File) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

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

    if (image) {
      formData.append("image", image);
    }

    return api.post<PersonResponseDto>("/people", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll() {
    return api.get<PersonResponseDto[]>("/people");
  },

  getById(id: string) {
    return api.get<PersonResponseDto>(`/people/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<PersonResponseDto>(`/people/slug/${slug}`);
  },

  updateById(id: string, data: UpdatePersonDto) {
    return api.patch<PersonResponseDto>(`/people/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/people/${id}`);
  },

  updateBySlug(slug: string, data: UpdatePersonDto) {
    return api.patch<PersonResponseDto>(`/people/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/people/slug/${slug}`);
  },

  updateImage(slug: string, image: File) {
    const formData = new FormData();

    formData.append("image", image);

    return api.patch<ImagePersonResponseDto>(
      `/people/slug/${slug}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  removeImage(slug: string) {
    return api.delete(`/people/slug/${slug}/image`);
  },
};
