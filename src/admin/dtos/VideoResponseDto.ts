export interface VideoResponseDto {
  id: string;

  title: string;

  embedLink: string;

  description: string | null;

  people: string[];

  createdAt: string;
}
