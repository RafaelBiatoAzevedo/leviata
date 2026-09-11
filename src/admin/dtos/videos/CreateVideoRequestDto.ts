export interface CreateVideoRequestDto {
  title: string;

  videoUrl: string;

  description?: string;

  people?: string[];
}
