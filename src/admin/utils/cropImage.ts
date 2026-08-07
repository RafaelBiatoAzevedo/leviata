import type { Area } from "react-easy-crop";

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.crossOrigin = "anonymous";

    image.src = url;

    image.onload = () => resolve(image);

    image.onerror = reject;
  });
}

export async function getCroppedImg(
  imageSrc: string,
  crop: Area,
): Promise<File> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");

  canvas.width = crop.width;

  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas não suportado.");
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Erro ao criar Blob."));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      0.9,
    );
  });

  return new File([blob], "person-image.jpg", {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
