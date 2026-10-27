import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  FiCamera,
  FiCheck,
  FiCrop,
  FiImage,
  FiLoader,
  FiUploadCloud,
} from "react-icons/fi";
import { AdminField } from "../AdminField";
import {
  imageVariants,
  type ImageCropSettings,
  type ImageVariant,
} from "../AdminImageEditor/types";
import {
  Actions,
  Container,
  HiddenInput,
  Preview,
  PreviewImage,
  Placeholder,
  ChangeButton,
  EditButton,
  PreviewOverlay,
  DropHint,
  FormatSelector,
  FormatOptions,
  FormatOption,
  FormatShape,
  FormatHint,
  PreviewColumn,
} from "./styles";

const ImageEditor = lazy(() =>
  import("../AdminImageEditor").then((module) => ({
    default: module.AdminImageEditor,
  })),
);

interface AdminImageUploadProps {
  label?: string;
  description?: string;
  error?: string;
  imageUrl?: string;
  accept?: string;
  variant?: ImageVariant;
  allowVariantSelection?: boolean;
  formatPlacement?: "top" | "left";
  icon?: ReactNode;
  onChange?: (file: File | null) => Promise<string | void>;
}
interface EditSource {
  id: string;
  file: File;
  variant: ImageVariant;
  settings?: ImageCropSettings;
}
interface AppliedSource {
  file: File;
  settings: ImageCropSettings;
  imageUrl: string;
  variant: ImageVariant;
}

const formatOptions = [
  { variant: "square", label: "Quadrada" },
  { variant: "landscape", label: "Horizontal" },
  { variant: "portrait", label: "Vertical" },
] satisfies { variant: ImageVariant; label: string }[];

export function AdminImageUpload({
  label = "Imagem",
  description,
  error,
  imageUrl,
  accept = "image/*",
  variant = "square",
  allowVariantSelection = false,
  formatPlacement = "top",
  icon,
  onChange,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(false);
  const previewUrls = useRef(new Set<string>());
  const [editor, setEditor] = useState<EditSource | null>(null);
  const [applied, setApplied] = useState<AppliedSource | null>(null);
  const [opening, setOpening] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(variant);
  const activeVariant = allowVariantSelection ? selectedVariant : variant;
  const formatSide = allowVariantSelection && formatPlacement === "left";

  useEffect(() => {
    mounted.current = true;
    const urls = previewUrls.current;
    return () => {
      mounted.current = false;
      controller.current?.abort();
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  useEffect(() => {
    for (const url of previewUrls.current) {
      if (url !== imageUrl) {
        URL.revokeObjectURL(url);
        previewUrls.current.delete(url);
      }
    }
  }, [imageUrl]);

  function openFile(file: File) {
    if (file.type && !file.type.startsWith("image/")) {
      setLocalError("Selecione um arquivo de imagem.");
      return;
    }
    setLocalError("");
    setEditor({ id: crypto.randomUUID(), file, variant: activeVariant });
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) openFile(file);
  }

  async function editImage(nextVariant = activeVariant) {
    if (!imageUrl || opening || editor) return;
    setLocalError("");
    if (applied?.imageUrl === imageUrl) {
      setEditor({
        id: crypto.randomUUID(),
        file: applied.file,
        variant: nextVariant,
        settings:
          applied.variant === nextVariant ? applied.settings : undefined,
      });
      return;
    }
    const request = new AbortController();
    controller.current?.abort();
    controller.current = request;
    setOpening(true);
    try {
      const response = await fetch(imageUrl, { signal: request.signal });
      if (!response.ok) throw new Error("Imagem indisponível");
      const blob = await response.blob();
      if (request.signal.aborted) return;
      const name =
        new URL(imageUrl, window.location.href).pathname.split("/").pop() ||
        "imagem";
      setEditor({
        id: crypto.randomUUID(),
        file: new File([blob], name, { type: blob.type }),
        variant: nextVariant,
      });
    } catch {
      if (!request.signal.aborted)
        setLocalError(
          "Não foi possível abrir a imagem cadastrada. Selecione o arquivo para ajustar o recorte.",
        );
    } finally {
      if (!request.signal.aborted) setOpening(false);
    }
  }

  async function applyImage(file: File, settings: ImageCropSettings) {
    if (!editor) return;
    const nextUrl = await onChange?.(file);
    if (!mounted.current) {
      if (nextUrl?.startsWith("blob:")) URL.revokeObjectURL(nextUrl);
      return;
    }
    if (nextUrl) {
      if (nextUrl.startsWith("blob:")) previewUrls.current.add(nextUrl);
      setApplied({
        file: editor.file,
        settings,
        imageUrl: nextUrl,
        variant: editor.variant,
      });
    }
    setSelectedVariant(editor.variant);
    setEditor(null);
  }

  function chooseVariant(nextVariant: ImageVariant) {
    if (opening || editor || nextVariant === activeVariant) return;
    if (imageUrl) void editImage(nextVariant);
    else setSelectedVariant(nextVariant);
  }

  function detectVariant(image: HTMLImageElement) {
    if (!allowVariantSelection || applied?.imageUrl === imageUrl || editor)
      return;
    if (!image.naturalWidth || !image.naturalHeight) return;
    const aspect = image.naturalWidth / image.naturalHeight;
    const closest = formatOptions.reduce((best, option) =>
      Math.abs(Math.log(aspect / imageVariants[option.variant].aspect)) <
      Math.abs(Math.log(aspect / imageVariants[best.variant].aspect))
        ? option
        : best,
    );
    setSelectedVariant(closest.variant);
  }

  function dropFile(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && !opening) openFile(file);
  }

  return (
    <AdminField description={description} error={localError || error}>
      <Container $formatSide={formatSide}>
        {allowVariantSelection && (
          <FormatSelector
            $side={formatSide}
            disabled={opening || !!editor}
            aria-label={`Formato da ${label.toLocaleLowerCase("pt-BR")}`}
          >
            <legend>
              {formatSide
                ? "Formato"
                : `Formato da ${label.toLocaleLowerCase("pt-BR")}`}
            </legend>
            <FormatOptions $side={formatSide}>
              {formatOptions.map((option) => (
                <FormatOption
                  key={option.variant}
                  type="button"
                  $side={formatSide}
                  aria-pressed={activeVariant === option.variant}
                  onClick={() => chooseVariant(option.variant)}
                >
                  {activeVariant === option.variant && (
                    <FiCheck aria-hidden="true" />
                  )}
                  <FormatShape $variant={option.variant} aria-hidden="true" />
                  <strong>{option.label}</strong>
                  <span>{imageVariants[option.variant].ratio}</span>
                </FormatOption>
              ))}
            </FormatOptions>
            <FormatHint>
              {imageUrl
                ? "Troque o formato para ajustar o enquadramento."
                : "Escolha o formato e selecione uma imagem para recortar."}
            </FormatHint>
          </FormatSelector>
        )}
        <PreviewColumn>
          <HiddenInput
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFile}
          />
          <Preview
            type="button"
            $variant={activeVariant}
            $dragging={dragging}
            disabled={opening}
            aria-label={
              imageUrl
                ? `Ajustar ${label.toLocaleLowerCase("pt-BR")}`
                : `Selecionar ${label.toLocaleLowerCase("pt-BR")}`
            }
            aria-haspopup="dialog"
            onClick={() =>
              imageUrl ? void editImage() : inputRef.current?.click()
            }
            onDragOver={(event) => {
              event.preventDefault();
              if (event.dataTransfer.types.includes("Files")) setDragging(true);
            }}
            onDragLeave={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              )
                setDragging(false);
            }}
            onDrop={dropFile}
          >
            {imageUrl ? (
              <>
                <PreviewImage
                  src={imageUrl}
                  alt={label}
                  onLoad={(event) => detectVariant(event.currentTarget)}
                />
                <PreviewOverlay>
                  <FiCrop aria-hidden="true" />
                  Ajustar recorte
                </PreviewOverlay>
              </>
            ) : (
              <Placeholder>
                {icon ?? <FiImage size={42} />}
                <span>{`Selecionar ${label}`}</span>
              </Placeholder>
            )}
            {dragging && (
              <DropHint>
                <FiUploadCloud aria-hidden="true" />
                Solte a imagem aqui
              </DropHint>
            )}
          </Preview>
          <Actions
            $hasImage={!!imageUrl}
            role={imageUrl ? "group" : undefined}
            aria-label={imageUrl ? "Ações da imagem" : undefined}
          >
            <ChangeButton
              type="button"
              disabled={opening}
              aria-label={
                imageUrl
                  ? `Trocar ${label.toLocaleLowerCase("pt-BR")}`
                  : `Selecionar ${label}`
              }
              onClick={() => inputRef.current?.click()}
            >
              <FiCamera aria-hidden="true" />
              {imageUrl ? "Trocar" : `Selecionar ${label}`}
            </ChangeButton>
            {imageUrl && (
              <EditButton
                type="button"
                disabled={opening}
                aria-label={`Ajustar ${label.toLocaleLowerCase("pt-BR")}`}
                aria-haspopup="dialog"
                onClick={() => void editImage()}
              >
                {opening ? (
                  <FiLoader aria-hidden="true" />
                ) : (
                  <FiCrop aria-hidden="true" />
                )}
                {opening ? "Abrindo..." : "Ajustar"}
              </EditButton>
            )}
          </Actions>
        </PreviewColumn>
      </Container>
      {editor && (
        <Suspense
          fallback={<span role="status">Abrindo editor de imagem...</span>}
        >
          <ImageEditor
            key={editor.id}
            file={editor.file}
            label={label}
            variant={editor.variant}
            initialSettings={editor.settings}
            onCancel={() => setEditor(null)}
            onApply={applyImage}
          />
        </Suspense>
      )}
    </AdminField>
  );
}
