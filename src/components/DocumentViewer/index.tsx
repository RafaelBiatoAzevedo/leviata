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
} from "./styles";

import {
  FiDownload,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiPrinter,
  FiMaximize,
} from "react-icons/fi";

import { useEffect, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface IDocumentViewerProps {
  pdf: string;
  externalLink: string;
}

export function DocumentViewer({ pdf, externalLink }: IDocumentViewerProps) {
  const [pages, setPages] = useState(0);
  const [width, setWidth] = useState(900);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    function handleResize() {
      if (window.innerWidth < 768) {
        setWidth(window.innerWidth - 40);
      } else {
        setWidth(900);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleFullscreen() {
    const element = document.getElementById("pdf-viewer");

    if (!element) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element.requestFullscreen();
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
      <Viewer id="pdf-viewer" width={width}>
        <Actions>
          <ActionButton onClick={handleFullscreen}>
            <FiMaximize />
          </ActionButton>
          <ActionButton onClick={handlePrint}>
            <FiPrinter />
          </ActionButton>
          <ActionButton href={pdf} download>
            <FiDownload />
          </ActionButton>

          <ActionButton href={externalLink} target="_blank">
            <FiExternalLink />
          </ActionButton>
        </Actions>
        <Document
          file={pdf}
          loading={null}
          onLoadSuccess={({ numPages }) => setPages(numPages)}
          externalLinkTarget="_blank"
        >
          <Page
            key={currentPage}
            pageNumber={currentPage}
            width={isFullscreen ? window.innerWidth * 0.65 : width}
            loading={null}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
        <Pagination>
          <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
            <FiChevronLeft />
            Anterior
          </PageButton>

          <PageInfo>
            Página {currentPage} de {pages}
          </PageInfo>

          <PageButton onClick={handleNextPage} disabled={currentPage === pages}>
            Próxima
            <FiChevronRight />
          </PageButton>
        </Pagination>
      </Viewer>
    </Container>
  );
}
