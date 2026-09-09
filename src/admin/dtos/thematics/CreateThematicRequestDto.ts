export interface CreateThematicRequestDto {
  title: string;

  description?: string;

  mainVideoId?: string;

  coordinatorId?: string;

  additionalVideos?: string[];
}
