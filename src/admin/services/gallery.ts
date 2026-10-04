import { api } from "../../services/api";
import type { ImageResponseDto } from "../dtos/ImageResponseDto";

export type GalleryResource =
  | "boards"
  | "juries"
  | "meetings"
  | "presented-works"
  | "research";
export type GalleryCollection = "images" | "supports";

export interface ImageMetadata {
  title: string | null;
  description: string | null;
}

export function createGalleryService(
  resource: GalleryResource,
  collection: GalleryCollection = "images",
) {
  const path = (id: string) => `/${resource}/${id}/${collection}`;

  return {
    upload(id: string, image: File, metadata: ImageMetadata) {
      const data = new FormData();
      data.append("image", image);
      data.append("title", metadata.title ?? "");
      data.append("description", metadata.description ?? "");
      return api.post<ImageResponseDto>(path(id), data);
    },
    update(id: string, imageId: string, metadata: ImageMetadata) {
      return api.patch<ImageResponseDto>(`${path(id)}/${imageId}`, metadata);
    },
    remove(id: string, imageId: string) {
      return api.delete(`${path(id)}/${imageId}`);
    },
  };
}
