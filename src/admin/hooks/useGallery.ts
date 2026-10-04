import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ImageResponseDto } from "../dtos/ImageResponseDto";
import {
  createGalleryService,
  type GalleryCollection,
  type GalleryResource,
} from "../services/gallery";
import { saveGallery } from "../utils/saveGallery";

export const GALLERY_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/avif";
export const GALLERY_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export interface GalleryDraft {
  key: string;
  id?: string;
  file?: File;
  imageUrl: string;
  title: string;
  description: string;
  originalTitle?: string;
  originalDescription?: string;
}

function draft(image: ImageResponseDto): GalleryDraft {
  return {
    key: image.id,
    id: image.id,
    imageUrl: image.imageUrl,
    title: image.title ?? "",
    description: image.description ?? "",
    originalTitle: image.title ?? "",
    originalDescription: image.description ?? "",
  };
}

export function useGallery(
  resource: GalleryResource,
  collection: GalleryCollection = "images",
) {
  const [images, setImages] = useState<GalleryDraft[]>([]);
  const current = useRef<GalleryDraft[]>([]);
  const removed = useRef(new Set<string>());
  const previews = useRef(new Set<string>());
  const service = useMemo(
    () => createGalleryService(resource, collection),
    [resource, collection],
  );

  const write = useCallback((next: GalleryDraft[]) => {
    current.current = next;
    setImages(next);
  }, []);

  const load = useCallback(
    (saved: ImageResponseDto[] = []) => {
      previews.current.forEach((url) => URL.revokeObjectURL(url));
      previews.current.clear();
      removed.current.clear();
      write(saved.map(draft));
    },
    [write],
  );

  useEffect(() => {
    const urls = previews.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function add(files: File[]) {
    const types = GALLERY_IMAGE_ACCEPT.split(",");
    if (
      files.some(
        (file) =>
          !types.includes(file.type) || file.size >= GALLERY_IMAGE_MAX_BYTES,
      )
    ) {
      throw new Error(
        "Selecione imagens JPG, PNG, WebP, GIF ou AVIF com menos de 10 MB cada.",
      );
    }
    write([
      ...current.current,
      ...files.map((file) => {
        const imageUrl = URL.createObjectURL(file);
        previews.current.add(imageUrl);
        return {
          key: crypto.randomUUID(),
          file,
          imageUrl,
          title: "",
          description: "",
        };
      }),
    ]);
  }

  function update(
    key: string,
    values: Partial<Pick<GalleryDraft, "title" | "description">>,
  ) {
    write(
      current.current.map((image) =>
        image.key === key ? { ...image, ...values } : image,
      ),
    );
  }

  function remove(key: string) {
    const image = current.current.find((item) => item.key === key);
    if (image?.id) removed.current.add(image.id);
    if (image?.file) {
      URL.revokeObjectURL(image.imageUrl);
      previews.current.delete(image.imageUrl);
    }
    write(current.current.filter((item) => item.key !== key));
  }

  async function save(id: string) {
    try {
      await saveGallery(
        id,
        current.current,
        removed.current,
        service,
        (image, saved) => {
          if (image.file) {
            URL.revokeObjectURL(image.imageUrl);
            previews.current.delete(image.imageUrl);
          }
          const next = { ...draft(saved), key: image.key };
          write(
            current.current.map((item) =>
              item.key === image.key ? next : item,
            ),
          );
        },
      );
    } catch {
      throw new Error(
        `Os dados principais foram salvos, mas não foi possível salvar todas as ${collection === "supports" ? "imagens dos apoiadores" : "fotos"}. Clique em Salvar para tentar novamente.`,
      );
    }
  }

  return { images, load, add, update, remove, save };
}

export type GalleryEditor = ReturnType<typeof useGallery>;
