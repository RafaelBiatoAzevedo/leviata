import type { ChangeEvent, ReactNode } from "react";
import { useRef, useState } from "react";

import { FiFileText, FiUploadCloud } from "react-icons/fi";

import { AdminField } from "../AdminField";

import {
  Container,
  HiddenInput,
  Preview,
  Placeholder,
  FileName,
  FileType,
  ChangeButton,
} from "./styles";

interface AdminFileUploadProps {
  label?: string;
  description?: string;
  error?: string;
  fileUrl?: string;
  fileName?: string;
  accept?: string;
  icon?: ReactNode;
  onChange?: (file: File | null) => Promise<void>;
}

export function AdminFileUpload({
  label = "Arquivo",
  description,
  error,
  fileUrl,
  fileName,
  accept = "application/pdf",
  icon,
  onChange,
}: AdminFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>();

  const currentFileName = selectedFileName ?? fileName;

  function handleOpen() {
    inputRef.current?.click();
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (file) {
      setSelectedFileName(file.name);
    }

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

        <Preview
          $hasFile={Boolean(fileUrl || currentFileName)}
          onClick={handleOpen}
        >
          {fileUrl || currentFileName ? (
            <Placeholder>
              {icon ?? <FiFileText size={42} />}

              <FileName>{currentFileName ?? "Arquivo PDF"}</FileName>

              <FileType>PDF</FileType>
            </Placeholder>
          ) : (
            <Placeholder>
              {icon ?? <FiUploadCloud size={42} />}

              <span>Selecionar {label}</span>
            </Placeholder>
          )}
        </Preview>

        <ChangeButton type="button" onClick={handleOpen}>
          <FiUploadCloud />

          {fileUrl || currentFileName
            ? `Alterar ${label}`
            : `Selecionar ${label}`}
        </ChangeButton>
      </Container>
    </AdminField>
  );
}
