export interface CreateNewsletterRequestDto {
  title: string;
  subject: string;
  htmlContent: string;
  coverUrl?: string;
  pdfUrl?: string;
  publishedAt?: string;
  sentAt?: string;
}
