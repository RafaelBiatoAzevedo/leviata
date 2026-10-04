export interface NewsletterResponseDto {
  id: string;
  slug: string;
  title: string;
  subject: string;
  htmlContent: string;
  coverUrl: string | null;
  pdfUrl: string | null;
  publishedAt: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
}
