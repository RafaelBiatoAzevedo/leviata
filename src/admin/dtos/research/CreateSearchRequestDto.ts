export interface CreateSearchRequestDto {
  title: string;

  content?: string;

  people: string[];

  images?: string[];

  supports?: string[];
}
