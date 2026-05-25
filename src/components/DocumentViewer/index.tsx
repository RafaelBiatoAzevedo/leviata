import { Document, Page, pdfjs } from "react-pdf";

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

  const [currentPage, setCurrentPage] = useState(1);

  function handlePrevPage() {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  }

  function handleNextPage() {
    setCurrentPage((prev) => (prev < pages ? prev + 1 : prev));
  }

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

  return (
    <Container>
      <Actions>
        <ActionButton href={pdf} download>
          <FiDownload />
        </ActionButton>

        <ActionButton href={externalLink} target="_blank">
          <FiExternalLink />
        </ActionButton>
      </Actions>

      <Viewer>
        <Document
          file={pdf}
          loading={null}
          onLoadSuccess={({ numPages }) => setPages(numPages)}
        >
          <Page
            key={currentPage}
            pageNumber={currentPage}
            width={width}
            loading={null}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </Viewer>

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
    </Container>
  );
}
