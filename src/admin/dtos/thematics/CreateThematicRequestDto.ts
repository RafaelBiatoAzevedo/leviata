export interface CreateThematicRequestDto {
  title: string;

  description?: string | null;

  mainVideoId?: string | null;

  coordinatorId?: string | null;

  additionalVideos?: ThematicVideoRequestDto[];
}
import type { ThematicVideoRequestDto } from "./ThematicVideoRequestDto";
