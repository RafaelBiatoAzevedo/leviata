import type {
  AdminListQuery,
  PaginatedResponseDto,
} from "../dtos/PaginatedResponseDto";
import { api } from "../../services/api";
import type { CreateNewsletterRequestDto } from "../dtos/newsletter/CreateNewsletterRequestDto";
import type { NewsletterResponseDto } from "../dtos/newsletter/NewsletterResponseDto";
import type { UpdateNewsletterRequestDto } from "../dtos/newsletter/UpdateNewsletterRequestDto";
import type { ImageUploadResponseDto } from "../dtos/ImageUploadResponseDto";

export const newsletterService = {
  create(data: CreateNewsletterRequestDto, cover?: File) {
    if (!cover) return api.post<NewsletterResponseDto>("/newsletter", data);
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== "")
        form.append(key, value);
    }
    form.append("cover", cover);
    return api.post<NewsletterResponseDto>("/newsletter", form);
  },
  updateCover(slug: string, cover: File) {
    const form = new FormData();
    form.append("cover", cover);
    return api.patch<ImageUploadResponseDto>(
      `/newsletter/slug/${encodeURIComponent(slug)}/cover`,
      form,
    );
  },
  getPage(params: AdminListQuery = {}, signal?: AbortSignal) {
    return api.get<PaginatedResponseDto<NewsletterResponseDto>>(
      "/newsletter/paginated",
      { params, signal },
    );
  },

  getAll() {
    return api.get<NewsletterResponseDto[]>("/newsletter");
  },
  getBySlug(slug: string) {
    return api.get<NewsletterResponseDto>(`/newsletter/slug/${slug}`);
  },
  updateBySlug(slug: string, data: UpdateNewsletterRequestDto) {
    return api.patch<NewsletterResponseDto>(`/newsletter/slug/${slug}`, data);
  },
  removeBySlug(slug: string) {
    return api.delete(`/newsletter/slug/${slug}`);
  },
};
