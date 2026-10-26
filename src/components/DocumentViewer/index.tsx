import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiMaximize,
  FiMinimize,
  FiPrinter,
} from "react-icons/fi";
import { fitPdfPageWidth } from "../../utils/pdfPage";
import {
  ActionButton,
  Actions,
  Container,
  Feedback,
  PageButton,
  PageInfo,
  Pagination,
  ReaderTitle,
  Stage,
  Toolbar,
  Viewer,
  ViewerMessage,
} from "./styles";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface DocumentViewerProps {
  pdf: string;
  externalLink?: string | null;
}

export function DocumentViewer(props: DocumentViewerProps) {
  return <DocumentReader key={props.pdf} {...props} />;
}

function DocumentReader({ pdf, externalLink }: DocumentViewerProps) {
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [bounds, setBounds] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [pageSizes, setPageSizes] = useState<
    Record<number, { width: number; height: number }>
  >({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [actionError, setActionError] = useState("");
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const loadedPdf = useRef<PDFDocumentProxy | null>(null);
  const mounted = useRef(true);
  const printResources = useRef<{
    frame: HTMLIFrameElement;
    url: string;
    timer: number;
  } | null>(null);
  const fullscreenSupported =
    typeof document !== "undefined" && document.fullscreenEnabled;

  const clearPrint = useCallback(() => {
    const resources = printResources.current;
    if (!resources) return;
    window.clearTimeout(resources.timer);
    resources.frame.remove();
    URL.revokeObjectURL(resources.url);
    printResources.current = null;
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearPrint();
    };
  }, [clearPrint]);

  useEffect(() => {
    const update = () =>
      setIsFullscreen(document.fullscreenElement === viewerRef.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0)
        setBounds({ width: Math.floor(width), height: Math.floor(height) });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  async function fullscreen() {
    const element = viewerRef.current;
    if (!element) return;
    setActionError("");
    try {
      if (document.fullscreenElement === element)
        await document.exitFullscreen();
      else await element.requestFullscreen();
    } catch {
      setActionError(
        "Não foi possível ampliar o leitor. Use a opção Abrir para visualizar o documento em outra aba.",
      );
    }
  }

  async function print() {
    const documentPdf = loadedPdf.current;
    if (!documentPdf || printing) return;
    setPrinting(true);
    setActionError("");
    clearPrint();
    try {
      // Reuse the already loaded PDF; the local blob also avoids cross-origin printing.
      const data = await documentPdf.getData();
      if (!mounted.current) return;
      const url = URL.createObjectURL(
        new Blob([new Uint8Array(data)], { type: "application/pdf" }),
      );
      const frame = document.createElement("iframe");
      frame.title = "Impressão do documento PDF";
      frame.setAttribute("aria-hidden", "true");
      Object.assign(frame.style, {
        position: "fixed",
        width: "1px",
        height: "1px",
        opacity: "0",
        pointerEvents: "none",
        border: "0",
      });
      frame.onload = () => {
        try {
          if (!frame.contentWindow) throw new Error("Documento indisponível");
          frame.contentWindow.addEventListener("afterprint", clearPrint, {
            once: true,
          });
          frame.contentWindow.focus();
          frame.contentWindow.print();
        } catch {
          clearPrint();
          if (mounted.current)
            setActionError(
              "Não foi possível abrir a impressão. Abra o PDF em outra aba para imprimir pelo navegador.",
            );
        } finally {
          if (mounted.current) setPrinting(false);
        }
      };
      frame.onerror = () => {
        clearPrint();
        if (mounted.current) {
          setPrinting(false);
          setActionError(
            "Não foi possível preparar a impressão. Abra o PDF em outra aba.",
          );
        }
      };
      printResources.current = {
        frame,
        url,
        timer: window.setTimeout(() => {
          clearPrint();
          if (mounted.current) setPrinting(false);
        }, 60000),
      };
      frame.src = url;
      document.body.appendChild(frame);
    } catch {
      if (mounted.current) {
        setPrinting(false);
        setActionError(
          "Não foi possível preparar a impressão. Abra o PDF em outra aba.",
        );
      }
    }
  }

  const pageSize = pageSizes[currentPage] || { width: 595, height: 842 };
  const width = bounds ? fitPdfPageWidth(bounds, pageSize) : 1;

  return (
    <Container>
      <Viewer
        ref={viewerRef}
        role="region"
        aria-label="Leitor de documento PDF"
      >
        <Toolbar>
          <ReaderTitle>
            <FiFileText aria-hidden="true" />
            <span>Leitor de PDF</span>
          </ReaderTitle>
          <Actions role="group" aria-label="Opções do documento">
            <ActionButton
              as="button"
              type="button"
              onClick={fullscreen}
              disabled={!fullscreenSupported}
              title={isFullscreen ? "Sair da tela cheia" : "Ver em tela cheia"}
              aria-label={
                isFullscreen ? "Sair da tela cheia" : "Ver em tela cheia"
              }
            >
              {isFullscreen ? (
                <FiMinimize aria-hidden="true" />
              ) : (
                <FiMaximize aria-hidden="true" />
              )}
              <span>{isFullscreen ? "Reduzir" : "Ampliar"}</span>
            </ActionButton>
            <ActionButton
              as="button"
              type="button"
              onClick={print}
              disabled={!pages || printing}
              title="Imprimir documento"
              aria-label={
                printing ? "Preparando impressão" : "Imprimir documento"
              }
            >
              <FiPrinter aria-hidden="true" />
              <span>{printing ? "Preparando…" : "Imprimir"}</span>
            </ActionButton>
            <ActionButton
              href={pdf}
              download
              target="_blank"
              rel="noopener noreferrer"
              title="Baixar PDF"
              aria-label="Baixar documento PDF"
            >
              <FiDownload aria-hidden="true" />
              <span>Baixar PDF</span>
            </ActionButton>
            <ActionButton
              href={externalLink || pdf}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir em nova aba"
              aria-label="Abrir documento em nova aba"
            >
              <FiExternalLink aria-hidden="true" />
              <span>Abrir</span>
            </ActionButton>
          </Actions>
        </Toolbar>
        <Stage ref={stageRef}>
          <Document
            file={pdf}
            loading={
              <ViewerMessage role="status">Carregando documento…</ViewerMessage>
            }
            error={
              <ViewerMessage role="alert">
                Não foi possível visualizar o documento.{" "}
                <a href={pdf} target="_blank" rel="noopener noreferrer">
                  Abrir PDF em nova aba
                </a>
              </ViewerMessage>
            }
            onLoadSuccess={(documentPdf) => {
              loadedPdf.current = documentPdf;
              setPages(documentPdf.numPages);
              setFailed(false);
            }}
            onLoadError={() => {
              loadedPdf.current = null;
              setPages(0);
              setFailed(true);
            }}
            externalLinkTarget="_blank"
            externalLinkRel="noopener noreferrer"
          >
            {bounds && (
              <Page
                key={currentPage}
                pageNumber={currentPage}
                width={width}
                loading={
                  <ViewerMessage role="status">
                    Carregando página…
                  </ViewerMessage>
                }
                error={
                  <ViewerMessage role="alert">
                    Não foi possível carregar esta página.
                  </ViewerMessage>
                }
                onLoadSuccess={(page) => {
                  const size = {
                    width: page.originalWidth,
                    height: page.originalHeight,
                  };
                  setPageSizes((previous) =>
                    previous[page.pageNumber]?.width === size.width &&
                    previous[page.pageNumber]?.height === size.height
                      ? previous
                      : { ...previous, [page.pageNumber]: size },
                  );
                }}
                renderTextLayer
                renderAnnotationLayer
              />
            )}
          </Document>
        </Stage>
        <Pagination aria-label="Navegação do documento">
          <PageButton
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={!pages || currentPage <= 1}
            aria-label="Página anterior"
            title="Página anterior"
          >
            <FiChevronLeft aria-hidden="true" />
            <span>Anterior</span>
          </PageButton>
          <PageInfo
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label={
              pages
                ? `Página ${currentPage} de ${pages}`
                : failed
                  ? "Documento indisponível"
                  : "Carregando páginas"
            }
          >
            <small>Página</small>
            <strong>
              {pages ? currentPage : "—"}
              <span> / </span>
              {pages || "—"}
            </strong>
          </PageInfo>
          <PageButton
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                pages ? Math.min(pages, page + 1) : page,
              )
            }
            disabled={!pages || currentPage >= pages}
            aria-label="Próxima página"
            title="Próxima página"
          >
            <span>Próxima</span>
            <FiChevronRight aria-hidden="true" />
          </PageButton>
        </Pagination>
      </Viewer>
      {actionError && (
        <Feedback role="status">
          {actionError}{" "}
          <a href={pdf} target="_blank" rel="noopener noreferrer">
            Abrir PDF em nova aba
          </a>
        </Feedback>
      )}
    </Container>
  );
}
