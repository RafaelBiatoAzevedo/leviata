import type { NewsletterContentDto } from "./NewsletterContentDto";

export interface CreateNewsletterRequestDto {
  title: string;
  subject: string;
  htmlContent?: string;
  contentData?: NewsletterContentDto;
  coverUrl?: string;
  publishedAt?: string;
  sentAt?: string;
}
