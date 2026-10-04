import type {
  AdminListQuery,
  PaginatedResponseDto,
} from "../dtos/PaginatedResponseDto";
import { api } from "../../services/api";
import type { CreateNewsletterRequestDto } from "../dtos/newsletter/CreateNewsletterRequestDto";
import type { NewsletterResponseDto } from "../dtos/newsletter/NewsletterResponseDto";
import type { UpdateNewsletterRequestDto } from "../dtos/newsletter/UpdateNewsletterRequestDto";

export const newsletterService = {
  create(data: CreateNewsletterRequestDto) {
    return api.post<NewsletterResponseDto>("/newsletter", data);
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
