import type { CreateThematicRequestDto } from "../dtos/thematics/CreateThematicRequestDto";
import type { ThematicResponseDto } from "../dtos/thematics/ThematicResponseDto";
import type { ThematicFormData } from "../validations/thematic.schema";

export function mapThematicToForm(
  thematic: ThematicResponseDto,
): ThematicFormData {
  return {
    title: thematic.title,

    description: thematic.description ?? "",

    mainVideoId: thematic.mainVideoId ?? "",

    coordinatorId: thematic.coordinatorId,

    additionalVideos: (thematic.additionalVideos || []).map(
      (video) => video.videoId,
    ),
  };
}

export function mapThematicToCreateDto(
  data: ThematicFormData,
): CreateThematicRequestDto {
  return {
    title: data.title,

    description: data.description || undefined,

    mainVideoId: data.mainVideoId || undefined,

    coordinatorId: data.coordinatorId || undefined,

    additionalVideos: data.additionalVideos,
  };
}
