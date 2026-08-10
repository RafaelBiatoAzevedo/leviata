export interface CreateBookRequestDto {
  title: string;
  subtitle?: string;
  description?: string;
  isbn?: string;
  year?: number;
  publisher?: string;
  externalUrl?: string;
  authors: string[];
}
