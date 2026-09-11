import type { VideoResponseDto } from "../dtos/videos/VideoResponseDto";

import type { CreateVideoRequestDto } from "../dtos/videos/CreateVideoRequestDto";

import type { VideoFormData } from "../validations/video.schema";

export function mapVideoToForm(video: VideoResponseDto): VideoFormData {
  return {
    title: video.title,

    videoUrl: video.embedLink,

    description: video.description ?? "",

    people: video.people.map((person) => person.id!),
  };
}

export function mapVideoToCreateDto(
  data: VideoFormData,
): CreateVideoRequestDto {
  return {
    title: data.title,

    videoUrl: data.videoUrl,

    description: data.description,

    people: data.people,
  };
}
