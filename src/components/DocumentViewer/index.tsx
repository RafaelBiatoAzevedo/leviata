import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import {
  Container,
  Actions,
  ActionButton,
  Viewer,
  Pagination,
  PageButton,
  PageInfo,
  ViewerMessage,
} from "./styles";

import {
  FiDownload,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiPrinter,
  FiMaximize,
} from "react-icons/fi";

import { useEffect, useRef, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface IDocumentViewerProps {
  pdf: string;
  externalLink?: string | null;
}

export function DocumentViewer({ pdf, externalLink }: IDocumentViewerProps) {
  const [pages, setPages] = useState(0);
  const [width, setWidth] = useState(900);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  function handlePrevPage() {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  }

  function handleNextPage() {
    setCurrentPage((prev) => (prev < pages ? prev + 1 : prev));
  }

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }

    document.addEventListener("fullscreenchange", handleChange);

    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(
        Math.max(1, Math.min(1100, Math.floor(entry.contentRect.width))),
      );
    });
    observer.observe(viewer);
    return () => observer.disconnect();
  }, []);

  function handleFullscreen() {
    const element = viewerRef.current;

    if (!element) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element.requestFullscreen?.();
    }
  }

  function handlePrint() {
    const iframe = document.createElement("iframe");

    iframe.style.display = "none";
    iframe.src = pdf;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  }

  return (
    <Container>
      <Viewer ref={viewerRef}>
        <Actions>
          <ActionButton
            as="button"
            type="button"
            onClick={handleFullscreen}
            aria-label={
              isFullscreen ? "Sair da tela cheia" : "Ver em tela cheia"
            }
          >
            <FiMaximize />
          </ActionButton>
          <ActionButton
            as="button"
            type="button"
            onClick={handlePrint}
            aria-label="Imprimir documento"
          >
            <FiPrinter />
          </ActionButton>
          <ActionButton href={pdf} download aria-label="Baixar documento">
            <FiDownload />
          </ActionButton>

          <ActionButton
            href={externalLink || pdf}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir documento em nova aba"
          >
            <FiExternalLink />
          </ActionButton>
        </Actions>
        <Document
          file={pdf}
          loading={
            <ViewerMessage role="status">Carregando documento...</ViewerMessage>
          }
          error={
            <ViewerMessage role="alert">
              Não foi possível visualizar o documento.{" "}
              <a href={pdf} target="_blank" rel="noopener noreferrer">
                Abrir PDF em nova aba
              </a>
            </ViewerMessage>
          }
          onLoadSuccess={({ numPages }) => setPages(numPages)}
          externalLinkTarget="_blank"
        >
          <Page
            key={currentPage}
            pageNumber={currentPage}
            width={width}
            loading={null}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
        {pages > 0 && (
          <Pagination>
            <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
              <FiChevronLeft />
              Anterior
            </PageButton>

            <PageInfo>
              Página {currentPage} de {pages}
            </PageInfo>

            <PageButton
              onClick={handleNextPage}
              disabled={pages === 0 || currentPage >= pages}
            >
              Próxima
              <FiChevronRight />
            </PageButton>
          </Pagination>
        )}
      </Viewer>
    </Container>
  );
}
