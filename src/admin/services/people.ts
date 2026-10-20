import type {
  AdminListQuery,
  PaginatedResponseDto,
} from "../dtos/PaginatedResponseDto";
import type { CreatePersonDto } from "../dtos/people/CreatePersonRequestDto";
import type { PersonResponseDto } from "../dtos/people/PersonResponseDto";
import type { UpdatePersonDto } from "../dtos/people/UpdatePersonRequestDto";
import { api } from "../../services/api";
import type { ImageUploadResponseDto } from "../dtos/ImageUploadResponseDto";
import { loadAllPages } from "../../utils/loadAllPages";

const personNameCollator = new Intl.Collator("pt-BR", { sensitivity: "base" });

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

  getPage(params: AdminListQuery = {}, signal?: AbortSignal) {
    return api.get<PaginatedResponseDto<PersonResponseDto>>(
      "/people/paginated",
      { params, signal },
    );
  },

  getAll(params: AdminListQuery = {}, signal?: AbortSignal) {
    return api.get<PersonResponseDto[]>("/people", { params, signal });
  },

  getAllAvailable(signal?: AbortSignal) {
    return loadAllPages((params) => peopleService.getAll(params, signal));
  },

  async getForSelect(signal?: AbortSignal) {
    const people = await peopleService.getAllAvailable(signal);
    return [...people].sort((first, second) =>
      personNameCollator.compare(first.name, second.name),
    );
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

    return api.patch<ImageUploadResponseDto>(
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
