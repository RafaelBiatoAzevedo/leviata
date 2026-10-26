import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import {
  FiCheck,
  FiCrop,
  FiCrosshair,
  FiLoader,
  FiMinus,
  FiMove,
  FiPlus,
  FiRefreshCw,
  FiRotateCcw,
  FiRotateCw,
  FiX,
} from "react-icons/fi";
import { createCroppedImage, drawImageCrop, loadImage } from "./canvas";
import {
  imageVariants,
  type ImageCropSettings,
  type ImageVariant,
} from "./types";
import {
  Dialog,
  Header,
  Heading,
  HeadingIcon,
  CloseButton,
  Workspace,
  Stage,
  StageMessage,
  Sidebar,
  PreviewPanel,
  PreviewCanvas,
  ControlGroup,
  ControlHeading,
  ZoomControls,
  ToolButton,
  Tools,
  ResetButton,
  Hint,
  ErrorMessage,
  Footer,
  FooterNote,
  FooterActions,
  ActionButton,
  Ratio,
} from "./styles";

interface AdminImageEditorProps {
  file: File;
  label: string;
  variant: ImageVariant;
  initialSettings?: ImageCropSettings;
  onCancel(): void;
  onApply(file: File, settings: ImageCropSettings): Promise<void>;
}

export function AdminImageEditor({
  file,
  label,
  variant,
  initialSettings,
  onCancel,
  onApply,
}: AdminImageEditorProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const preview = useRef<HTMLCanvasElement>(null);
  const headingId = useId();
  const hintId = useId();
  const zoomId = useId();
  const [media, setMedia] = useState<{
    url: string;
    image: HTMLImageElement;
  } | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(initialSettings?.rotation ?? 0);
  const [area, setArea] = useState<{ pixels: Area; percentages: Area } | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const config = imageVariants[variant];

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  useEffect(() => {
    let active = true;
    const url = URL.createObjectURL(file);
    loadImage(url)
      .then((image) => {
        if (active) setMedia({ url, image });
      })
      .catch((reason: unknown) => {
        if (active)
          setError(
            reason instanceof Error
              ? reason.message
              : "Não foi possível abrir a imagem.",
          );
      });
    return () => {
      active = false;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    if (media && area && preview.current)
      drawImageCrop(preview.current, media.image, area.pixels, rotation, 240);
  }, [media, area, rotation]);

  function reset() {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  }

  async function apply() {
    if (!media || !area || saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await createCroppedImage(
        media.image,
        area.pixels,
        rotation,
        file,
      );
      await onApply(result, { area: area.percentages, rotation });
    } catch {
      setError("Não foi possível aplicar a imagem. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (typeof document === "undefined") return null;
  return createPortal(
    <Dialog
      ref={dialog}
      aria-labelledby={headingId}
      aria-describedby={hintId}
      aria-busy={saving}
      onCancel={(event) => {
        event.preventDefault();
        if (!saving) onCancel();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget || saving) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onCancel();
      }}
    >
      <Header>
        <HeadingIcon>
          <FiCrop aria-hidden="true" />
        </HeadingIcon>
        <Heading>
          <span>Imagem principal</span>
          <h2 id={headingId}>Ajustar {label.toLocaleLowerCase("pt-BR")}</h2>
        </Heading>
        <CloseButton
          type="button"
          aria-label="Fechar editor de imagem"
          disabled={saving}
          onClick={onCancel}
        >
          <FiX aria-hidden="true" />
        </CloseButton>
      </Header>

      <Workspace inert={saving}>
        <div>
          <Stage>
            {media ? (
              <Cropper
                image={media.url}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={config.aspect}
                minZoom={1}
                maxZoom={4}
                zoomSpeed={0.5}
                objectFit="contain"
                keyboardStep={5}
                disableAutomaticStylesInjection
                initialCroppedAreaPercentages={initialSettings?.area}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropAreaChange={(percentages, pixels) =>
                  setArea({ pixels, percentages })
                }
                cropperProps={{
                  "aria-label":
                    "Área de recorte. Arraste a imagem ou use as setas do teclado para mover.",
                  "aria-describedby": hintId,
                }}
                style={{
                  cropAreaStyle: {
                    color: "#C6A15B",
                    border: "2px solid #C6A15B",
                    borderRadius: 8,
                    boxShadow: "0 0 0 9999px rgba(8, 12, 20, 0.68)",
                  },
                }}
              />
            ) : (
              <StageMessage role="status">
                {error ? (
                  <>
                    <FiCrop aria-hidden="true" />
                    <span>Imagem indisponível</span>
                  </>
                ) : (
                  <>
                    <FiLoader data-spinning aria-hidden="true" />
                    <span>Preparando imagem...</span>
                  </>
                )}
              </StageMessage>
            )}
          </Stage>
          <Hint id={hintId}>
            <FiMove aria-hidden="true" />
            <span>
              Arraste para enquadrar. Use o zoom ou o gesto de pinça no celular.
            </span>
          </Hint>
        </div>

        <Sidebar>
          <PreviewPanel>
            <span>Prévia do recorte</span>
            <div>
              <PreviewCanvas
                ref={preview}
                aria-label="Prévia da imagem recortada"
              />
            </div>
            <Ratio>
              {config.label}
              <strong>{config.ratio}</strong>
            </Ratio>
          </PreviewPanel>
          <ControlGroup>
            <ControlHeading>
              <label htmlFor={zoomId}>Zoom</label>
              <output htmlFor={zoomId}>{Math.round(zoom * 100)}%</output>
            </ControlHeading>
            <ZoomControls>
              <ToolButton
                type="button"
                aria-label="Diminuir zoom"
                title="Diminuir zoom"
                disabled={!area || zoom <= 1}
                onClick={() => setZoom((value) => Math.max(1, value - 0.1))}
              >
                <FiMinus aria-hidden="true" />
              </ToolButton>
              <input
                id={zoomId}
                type="range"
                min="1"
                max="4"
                step="0.01"
                value={zoom}
                disabled={!area}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
              <ToolButton
                type="button"
                aria-label="Aumentar zoom"
                title="Aumentar zoom"
                disabled={!area || zoom >= 4}
                onClick={() => setZoom((value) => Math.min(4, value + 0.1))}
              >
                <FiPlus aria-hidden="true" />
              </ToolButton>
            </ZoomControls>
          </ControlGroup>

          <ControlGroup>
            <ControlHeading>
              <span>Posição e rotação</span>
            </ControlHeading>
            <Tools>
              <ToolButton
                type="button"
                aria-label="Girar 90 graus à esquerda"
                title="Girar à esquerda"
                disabled={!area}
                onClick={() => setRotation((value) => (value + 270) % 360)}
              >
                <FiRotateCcw aria-hidden="true" />
              </ToolButton>
              <ToolButton
                type="button"
                aria-label="Girar 90 graus à direita"
                title="Girar à direita"
                disabled={!area}
                onClick={() => setRotation((value) => (value + 90) % 360)}
              >
                <FiRotateCw aria-hidden="true" />
              </ToolButton>
              <ToolButton
                type="button"
                aria-label="Centralizar imagem"
                title="Centralizar imagem"
                disabled={!area}
                onClick={() => setCrop({ x: 0, y: 0 })}
              >
                <FiCrosshair aria-hidden="true" />
              </ToolButton>
            </Tools>
          </ControlGroup>
          <ResetButton type="button" disabled={!area} onClick={reset}>
            <FiRefreshCw aria-hidden="true" />
            Restaurar ajustes
          </ResetButton>
        </Sidebar>
      </Workspace>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
      <Footer>
        <FooterNote>O recorte só será aplicado ao confirmar.</FooterNote>
        <FooterActions>
          <ActionButton type="button" disabled={saving} onClick={onCancel}>
            Cancelar
          </ActionButton>
          <ActionButton
            type="button"
            $primary
            disabled={!area || saving || !media}
            onClick={() => void apply()}
          >
            {saving ? (
              <FiLoader data-spinning aria-hidden="true" />
            ) : (
              <FiCheck aria-hidden="true" />
            )}
            {saving ? "Aplicando..." : "Aplicar recorte"}
          </ActionButton>
        </FooterActions>
      </Footer>
    </Dialog>,
    document.body,
  );
}
