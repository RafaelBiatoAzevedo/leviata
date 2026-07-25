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

interface AdminImageUploadProps {
  label?: string;
  description?: string;
  error?: string;
  imageUrl?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
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
