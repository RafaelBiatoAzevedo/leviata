import type { CreateThematicRequestDto } from "../dtos/thematics/CreateThematicRequestDto";
import type { ThematicResponseDto } from "../dtos/thematics/ThematicResponseDto";
import type { ThematicFormData } from "../validations/thematic.schema";

export function mapThematicToForm(
  thematic: ThematicResponseDto,
): ThematicFormData {
  return {
    title: thematic.title,

    description: thematic.description ?? "",

    mainVideoId: thematic.mainVideo?.id ?? "",

    coordinatorId: thematic.coordinator?.id ?? "",

    additionalVideos: (thematic.additionalVideos ?? []).map((link) => ({
      linkId: link.id,
      videoId: link.videoId,
      personId: link.person?.id ?? "",
      title: link.title,
      description: link.description ?? "",
    })),
  };
}

export function mapThematicToCreateDto(
  data: ThematicFormData,
): CreateThematicRequestDto {
  return {
    title: data.title,

    description: data.description?.trim() || null,

    mainVideoId: data.mainVideoId || null,

    coordinatorId: data.coordinatorId || null,

    additionalVideos: data.additionalVideos.map((link) => ({
      ...(link.linkId && { id: link.linkId }),
      videoId: link.videoId,
      personId: link.personId || null,
      title: link.title.trim(),
      description: link.description.trim() || null,
    })),
  };
}
