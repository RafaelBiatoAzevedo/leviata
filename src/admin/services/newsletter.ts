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
  pdf(id: string) {
    return api.get<Blob>(`/newsletter/${encodeURIComponent(id)}/pdf`, {
      responseType: "blob",
    });
  },
  create(data: CreateNewsletterRequestDto, cover?: File) {
    if (!cover) return api.post<NewsletterResponseDto>("/newsletter", data);
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== "")
        form.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value,
        );
    }
    form.append("cover", cover);
    return api.post<NewsletterResponseDto>("/newsletter", form);
  },
  preview(data: Partial<CreateNewsletterRequestDto>) {
    // sentAt is maintained by delivery processing and is not part of the draft preview.
    const draft = Object.fromEntries(
      Object.entries(data).filter(([key]) => key !== "sentAt"),
    );
    return api.post<{ htmlContent: string }>("/newsletter/preview", draft);
  },
  uploadContentImage(image: File) {
    const form = new FormData();
    form.append("image", image);
    return api.post<ImageUploadResponseDto>("/newsletter/images", form);
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
