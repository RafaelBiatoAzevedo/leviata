import type { ChangeEvent, ReactNode } from "react";
import { useRef } from "react";
import { FiCamera, FiImage } from "react-icons/fi";

import { AdminField } from "../AdminField";

import {
  Container,
  HiddenInput,
  Preview,
  PreviewImage,
  Placeholder,
  ChangeButton,
} from "./styles";

type ImageVariant = "portrait" | "landscape" | "square";

interface AdminImageUploadProps {
  label?: string;
  description?: string;
  error?: string;
  imageUrl?: string;
  accept?: string;
  variant?: ImageVariant;
  icon?: ReactNode;
  onChange?: (file: File | null) => Promise<void>;
}

export function AdminImageUpload({
  label = "Image",
  description,
  error,
  imageUrl,
  accept = "image/*",
  variant = "square",
  icon,
  onChange,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOpen() {
    inputRef.current?.click();
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    await onChange?.(file);

    event.target.value = "";
  }

  return (
    <AdminField description={description} error={error}>
      <Container>
        <HiddenInput
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFile}
        />

        <Preview $variant={variant} onClick={handleOpen}>
          {imageUrl ? (
            <PreviewImage src={imageUrl} alt={label} />
          ) : (
            <Placeholder>
              {icon ?? <FiImage size={42} />}

              <span>{`Selecionar ${label}`}</span>
            </Placeholder>
          )}
        </Preview>

        <ChangeButton type="button" onClick={handleOpen}>
          <FiCamera />

          {imageUrl ? `Alterar ${label}` : `Selecionar ${label}`}
        </ChangeButton>
      </Container>
    </AdminField>
  );
}
