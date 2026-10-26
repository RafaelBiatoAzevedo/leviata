import type { Area } from "react-easy-crop";

export type ImageVariant = "portrait" | "landscape" | "square";

export interface ImageCropSettings {
  area: Area;
  rotation: number;
}

export const imageVariants = {
  portrait: { aspect: 2 / 3, label: "Capa vertical", ratio: "2:3" },
  landscape: { aspect: 16 / 9, label: "Imagem horizontal", ratio: "16:9" },
  square: { aspect: 1, label: "Imagem quadrada", ratio: "1:1" },
} satisfies Record<
  ImageVariant,
  { aspect: number; label: string; ratio: string }
>;
