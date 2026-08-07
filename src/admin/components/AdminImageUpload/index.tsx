import { useRef, useState } from "react";
import { FiCamera, FiImage } from "react-icons/fi";
import Cropper, { Area } from "react-easy-crop";

import { getCroppedImg } from "@/utils/cropImage";

import { AdminField } from "../AdminField";

import {
  Container,
  HiddenInput,
  Preview,
  PreviewImage,
  Placeholder,
  ChangeButton,
} from "./styles";

interface AdminImageUploadProps {
  label?: string;
  description?: string;
  error?: string;
  imageUrl?: string;
  accept?: string;
  onChange?: (file: File | null) => Promise<void>;
}

export function AdminImageUpload({
  label,
  description,
  error,
  imageUrl,
  accept = "image/*",
  onChange,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [cropAreaPixels, setCropAreaPixels] = useState<Area>();

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(URL.createObjectURL(file));
  }

  function handleCropComplete(_: Area, croppedAreaPixels: Area) {
    setCropAreaPixels(croppedAreaPixels);
  }

  async function handleConfirm() {
    if (!cropAreaPixels) return;

    const file = await getCroppedImg(image, cropAreaPixels);

    await onChange(file);
  }

  function handleOpen() {
    inputRef.current?.click();
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    onChange?.(file);
  }

  return (
    <AdminField label={label} description={description} error={error}>
      <Container>
        <HiddenInput
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFile}
        />

        <Preview onClick={handleOpen}>
          {imageUrl ? (
            <PreviewImage src={imageUrl} alt="Preview" />
          ) : (
            <Placeholder>
              <FiImage size={42} />

              <span>Selecionar imagem</span>
            </Placeholder>
          )}
        </Preview>

        <ChangeButton type="button" onClick={handleOpen}>
          <FiCamera />
          Alterar imagem
        </ChangeButton>
      </Container>
    </AdminField>
  );
}
