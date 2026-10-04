import type { GalleryDraft } from "../hooks/useGallery";
import type { ImageResponseDto } from "../dtos/ImageResponseDto";
import type { ImageMetadata } from "../services/gallery";

interface GalleryService {
  upload(
    id: string,
    file: File,
    metadata: ImageMetadata,
  ): Promise<{ data: ImageResponseDto }>;
  update(
    id: string,
    imageId: string,
    metadata: ImageMetadata,
  ): Promise<{ data: ImageResponseDto }>;
  remove(id: string, imageId: string): Promise<unknown>;
}

export async function saveGallery(
  id: string,
  images: GalleryDraft[],
  removed: Set<string>,
  service: GalleryService,
  onSaved: (image: GalleryDraft, saved: ImageResponseDto) => void,
) {
  for (const image of [...images]) {
    const metadata = {
      title: image.title.trim() || null,
      description: image.description.trim() || null,
    };
    let saved: ImageResponseDto | undefined;
    if (image.file) {
      saved = (await service.upload(id, image.file, metadata)).data;
    } else if (
      image.id &&
      (image.title !== image.originalTitle ||
        image.description !== image.originalDescription)
    ) {
      saved = (await service.update(id, image.id, metadata)).data;
    }
    if (saved) onSaved(image, saved);
  }
  // Só exclua as imagens anteriores depois de concluir os novos uploads.
  for (const imageId of [...removed]) {
    await service.remove(id, imageId);
    removed.delete(imageId);
  }
}
