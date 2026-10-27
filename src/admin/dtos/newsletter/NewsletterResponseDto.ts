import type { NewsletterContentDto } from "./NewsletterContentDto";

export interface NewsletterResponseDto {
  id: string;
  slug: string;
  title: string;
  subject: string;
  htmlContent: string;
  contentData?: NewsletterContentDto | null;
  coverUrl: string | null;
  pdfUrl: string | null;
  pdfGeneratedAt?: string | null;
  publishedAt: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
}
