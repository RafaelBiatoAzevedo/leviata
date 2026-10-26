import type { Area } from "react-easy-crop";

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new Error(
          "Não foi possível abrir esta imagem. Tente um arquivo JPG, PNG ou WebP.",
        ),
      );
    image.src = url;
  });
}

export function drawImageCrop(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  area: Area,
  rotation = 0,
  maxSize = 2048,
) {
  if (
    ![area.x, area.y, area.width, area.height, rotation, maxSize].every(
      Number.isFinite,
    ) ||
    area.width <= 0 ||
    area.height <= 0 ||
    maxSize <= 0 ||
    !image.naturalWidth ||
    !image.naturalHeight
  )
    throw new Error("Ajuste o enquadramento antes de aplicar o recorte.");

  const scale = Math.min(1, maxSize / Math.max(area.width, area.height));
  canvas.width = Math.max(1, Math.round(area.width * scale));
  canvas.height = Math.max(1, Math.round(area.height * scale));
  const context = canvas.getContext("2d");
  if (!context)
    throw new Error("Não foi possível preparar o recorte da imagem.");

  const radians = (rotation * Math.PI) / 180;
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const rotatedWidth =
    Math.abs(Math.cos(radians) * width) + Math.abs(Math.sin(radians) * height);
  const rotatedHeight =
    Math.abs(Math.sin(radians) * width) + Math.abs(Math.cos(radians) * height);

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  // Draw directly into the final crop, avoiding a full-size intermediate canvas.
  context.scale(canvas.width / area.width, canvas.height / area.height);
  context.translate(rotatedWidth / 2 - area.x, rotatedHeight / 2 - area.y);
  context.rotate(radians);
  context.drawImage(image, -width / 2, -height / 2);
}

export async function createCroppedImage(
  image: HTMLImageElement,
  area: Area,
  rotation: number,
  source: File,
): Promise<File> {
  const canvas = document.createElement("canvas");
  drawImageCrop(canvas, image, area, rotation);
  const type =
    source.type === "image/jpeg"
      ? "image/jpeg"
      : source.type === "image/webp"
        ? "image/webp"
        : "image/png";
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error("Não foi possível gerar o arquivo recortado.")),
      type,
      0.94,
    );
  });
  const extension =
    blob.type === "image/jpeg"
      ? "jpg"
      : blob.type === "image/webp"
        ? "webp"
        : "png";
  const name =
    source.name.replace(/\.[^.]+$/, "").replace(/-recorte$/, "") || "imagem";
  return new File([blob], `${name}-recorte.${extension}`, {
    type: blob.type,
    lastModified: Date.now(),
  });
}
