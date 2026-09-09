import type { PersonResponseDto } from "../people/PersonResponseDto";
import type { VideoResponseDto } from "../VideoResponseDto";
import type { ThematicVideoResponseDto } from "./ThematicVideoResponseDto";

export interface ThematicResponseDto {
  id: string;

  title: string;

  slug: string;

  description?: string | null;

  mainVideoId: string;

  mainVideo: VideoResponseDto;

  coordinatorId: string;

  coordinator: PersonResponseDto;

  additionalVideos?: ThematicVideoResponseDto[];

  createdAt: string;

  updatedAt: string;

  deletedAt: string | null;

  deletedById: string | null;
}
