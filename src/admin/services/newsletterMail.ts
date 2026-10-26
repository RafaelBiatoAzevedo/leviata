import { api } from "../../services/api";
import type { PaginatedResponseDto } from "../dtos/PaginatedResponseDto";
import type {
  NewsletterMailSettings,
  NewsletterMailCampaign,
  NewsletterAudience,
  NewsletterRecipient,
  NewsletterDeliveryRecord,
} from "../dtos/newsletter/NewsletterMailDto";

export const newsletterMailService = {
  settings(signal?: AbortSignal) {
    return api.get<NewsletterMailSettings>("/mail/status", { signal });
  },
  status(id: string, signal?: AbortSignal) {
    return api.get<NewsletterMailCampaign>(`/mail/newsletters/${id}/status`, {
      signal,
    });
  },
  audience(id: string, signal?: AbortSignal) {
    return api.get<NewsletterAudience>(`/mail/newsletters/${id}/audience`, {
      signal,
    });
  },
  deliveries(id: string, page: number, limit: number, signal?: AbortSignal) {
    return api.get<PaginatedResponseDto<NewsletterRecipient>>(
      `/mail/newsletters/${id}/deliveries`,
      { params: { page, limit }, signal },
    );
  },
  records(id: string, page: number, limit: number, signal?: AbortSignal) {
    return api.get<PaginatedResponseDto<NewsletterDeliveryRecord>>(
      `/mail/newsletters/${id}/delivery-records`,
      { params: { page, limit }, signal },
    );
  },
  send(id: string) {
    return api.post<NewsletterMailCampaign>(`/mail/newsletters/${id}/send`);
  },
  retry(id: string) {
    return api.post<NewsletterMailCampaign>(`/mail/newsletters/${id}/retry`);
  },
  cancel(id: string) {
    return api.post<NewsletterMailCampaign>(`/mail/newsletters/${id}/cancel`);
  },
};
