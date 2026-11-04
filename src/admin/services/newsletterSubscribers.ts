import { api } from "../../services/api";
import type {
  AdminListQuery,
  PaginatedResponseDto,
} from "../dtos/PaginatedResponseDto";
import type {
  NewsletterSubscriberDto,
  SaveNewsletterSubscriberDto,
} from "../dtos/newsletter/NewsletterSubscriberDto";

const base = "/newsletter-subscribers";

export const newsletterSubscribersService = {
  getPage(params: AdminListQuery = {}, signal?: AbortSignal) {
    return api.get<PaginatedResponseDto<NewsletterSubscriberDto>>(base, {
      params,
      signal,
    });
  },
  getById(id: string, signal?: AbortSignal) {
    return api.get<NewsletterSubscriberDto>(`${base}/${id}`, { signal });
  },
  create(data: SaveNewsletterSubscriberDto) {
    return api.post<NewsletterSubscriberDto>(base, data);
  },
  updateById(id: string, data: SaveNewsletterSubscriberDto) {
    return api.patch<NewsletterSubscriberDto>(`${base}/${id}`, data);
  },
  removeById(id: string) {
    return api.delete(`${base}/${id}`);
  },
};
