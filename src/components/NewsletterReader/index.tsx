import { useEffect, useId, useRef } from "react";
import { FiFileText, FiX } from "react-icons/fi";
import type { NewsletterResponseDto } from "../../admin/dtos/newsletter/NewsletterResponseDto";
import { newsletterReaderDocument } from "../../utils/newsletterEditions";
import {
  CloseButton,
  Dialog,
  Frame,
  ReaderHeading,
  ReaderToolbar,
} from "./styles";

export function NewsletterReader({
  edition,
  onClose,
}: {
  edition: NewsletterResponseDto;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return (
    <Dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <ReaderToolbar>
        <ReaderHeading>
          <FiFileText aria-hidden="true" />
          <h2 id={titleId}>{edition.title}</h2>
        </ReaderHeading>
        <CloseButton
          type="button"
          aria-label="Fechar leitura"
          onClick={onClose}
          autoFocus
        >
          <FiX aria-hidden="true" />
        </CloseButton>
      </ReaderToolbar>
      <Frame
        title={`Conteúdo da newsletter: ${edition.title}`}
        srcDoc={newsletterReaderDocument(edition.htmlContent)}
        sandbox="allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
      />
    </Dialog>
  );
}
