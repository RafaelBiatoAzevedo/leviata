import { useState } from "react";
import { FiDownload, FiExternalLink, FiFileText } from "react-icons/fi";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import { StructureViewer } from "./StructureViewer";
import {
  Actions,
  Container,
  DocumentFrame,
  Reader,
  ResourceLink,
  ReaderStatus,
} from "./styles";

const documentation = `${import.meta.env.BASE_URL}documentacao/LEVIATA_DOCUMENTACAO_COMPLETA.html`;

export function AdminDocumentation() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Container>
      <AdminPageHeader
        title="Documentação do sistema"
        subtitle="Manuais do portal, administração, arquitetura, API e operação."
      >
        <Actions>
          <StructureViewer />
          <ResourceLink
            href={documentation}
            download="LEVIATA_DOCUMENTACAO_COMPLETA.html"
          >
            <FiDownload aria-hidden="true" />
            Baixar HTML
          </ResourceLink>
          <ResourceLink
            href={documentation}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiExternalLink aria-hidden="true" />
            Abrir em nova aba
          </ResourceLink>
        </Actions>
      </AdminPageHeader>

      <ReaderStatus role="status" aria-live="polite">
        <FiFileText aria-hidden="true" />
        {loaded
          ? "Use a busca, o sumário e a impressão do documento. As versões Markdown e os diagramas também estão disponíveis para download."
          : "Carregando documentação completa…"}
      </ReaderStatus>

      <Reader aria-label="Leitor da documentação" aria-busy={!loaded}>
        <DocumentFrame
          title="Documentação completa do Leviatã e o Cativeiro"
          src={documentation}
          sandbox="allow-scripts allow-downloads allow-modals allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
        />
      </Reader>
    </Container>
  );
}
