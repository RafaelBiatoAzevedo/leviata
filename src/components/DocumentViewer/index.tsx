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

import { useState } from "react";

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

  const [currentPage, setCurrentPage] = useState(1);

  function handlePrevPage() {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  }

  function handleNextPage() {
    setCurrentPage((prev) => (prev < pages ? prev + 1 : prev));
  }

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
          onLoadSuccess={({ numPages }) => setPages(numPages)}
        >
          <Page
            pageNumber={currentPage}
            width={900}
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
