import type { PersonResponseDto } from "../people/PersonResponseDto";
import type { VideoResponseDto } from "../videos/VideoResponseDto";

export interface ThematicVideoResponseDto {
  id: string;

  thematicId: string;

  videoId: string;

  personId: string | null;

  title: string;

  description: string | null;

  video: VideoResponseDto;

  person: PersonResponseDto | null;

  createdAt: string;
}
