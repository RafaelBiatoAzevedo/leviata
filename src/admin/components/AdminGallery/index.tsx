import { useId, useRef, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { AdminFormCard } from "../AdminFormCard";
import { AdminSection } from "../AdminSection";
import { AdminButton } from "../AdminButton";
import { AdminInput } from "../AdminInput";
import { AdminTextarea } from "../AdminTextarea";
import { AdminError } from "../AdminError";
import {
  GALLERY_IMAGE_ACCEPT,
  type GalleryEditor,
} from "../../hooks/useGallery";
import { Grid, Item, Preview, Fields } from "./styles";

interface AdminGalleryProps {
  gallery: GalleryEditor;
  title?: string;
  disabled?: boolean;
}

export function AdminGallery({
  gallery,
  title = "Fotos",
  disabled = false,
}: AdminGalleryProps) {
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const [error, setError] = useState("");

  return (
    <AdminFormCard>
      <AdminSection
        title={title}
        action={
          <AdminButton
            type="button"
            disabled={disabled}
            onClick={() => input.current?.click()}
          >
            <FiPlus /> Adicionar imagens
          </AdminButton>
        }
      >
        <input
          ref={input}
          type="file"
          multiple
          accept={GALLERY_IMAGE_ACCEPT}
          hidden
          disabled={disabled}
          aria-label={`Adicionar imagens: ${title}`}
          onChange={(event) => {
            try {
              gallery.add(Array.from(event.target.files ?? []));
              setError("");
            } catch (error) {
              setError(
                error instanceof Error
                  ? error.message
                  : "Não foi possível selecionar as imagens.",
              );
            }
            event.target.value = "";
          }}
        />
        <p>
          As imagens e legendas serão salvas ao clicar em Salvar. Título e
          descrição são opcionais.
        </p>
        {error && <AdminError>{error}</AdminError>}
        {gallery.images.length === 0 && <p>Nenhuma imagem adicionada.</p>}
        <Grid>
          {gallery.images.map((image, index) => (
            <Item key={image.key}>
              <Preview
                src={image.imageUrl}
                alt={image.title || `Imagem ${index + 1}`}
              />
              <Fields>
                <AdminInput
                  id={`${id}-${image.key}-title`}
                  label="Título (opcional)"
                  maxLength={255}
                  value={image.title}
                  disabled={disabled}
                  onChange={(event) =>
                    gallery.update(image.key, { title: event.target.value })
                  }
                />
                <AdminTextarea
                  id={`${id}-${image.key}-description`}
                  label="Descrição (opcional)"
                  rows={3}
                  maxLength={5000}
                  value={image.description}
                  disabled={disabled}
                  onChange={(event) =>
                    gallery.update(image.key, {
                      description: event.target.value,
                    })
                  }
                />
                <AdminButton
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  aria-label={`Remover imagem ${index + 1}`}
                  onClick={() => gallery.remove(image.key)}
                >
                  <FiTrash2 /> Remover imagem
                </AdminButton>
              </Fields>
            </Item>
          ))}
        </Grid>
      </AdminSection>
    </AdminFormCard>
  );
}
