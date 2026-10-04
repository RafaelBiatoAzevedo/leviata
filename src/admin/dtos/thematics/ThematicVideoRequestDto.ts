export interface ThematicVideoRequestDto {
  id?: string;
  videoId: string;
  personId?: string | null;
  title: string;
  description?: string | null;
}
