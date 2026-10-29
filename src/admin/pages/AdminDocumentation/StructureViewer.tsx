import { useId, useRef, useState } from "react";
import {
  FiDownload,
  FiExternalLink,
  FiMaximize2,
  FiMinimize2,
  FiShare2,
  FiX,
} from "react-icons/fi";
import { ResourceLink } from "./styles";
import {
  Close,
  Description,
  Dialog,
  DialogActions,
  DialogHeader,
  Feedback,
  ImageViewport,
} from "./structureStyles";

const structure = `${import.meta.env.BASE_URL}documentacao/LEVIATA_ESTRUTURA_DO_PROJETO.png`;

export function StructureViewer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [active, setActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  function open() {
    if (!dialog.current || dialog.current.open) return;
    setActive(true);
    setExpanded(false);
    setStatus("loading");
    dialog.current.showModal();
  }

  function toggleSize() {
    setExpanded((value) => !value);
    viewport.current?.scrollTo({ top: 0, left: 0 });
  }

  return (
    <>
      <ResourceLink
        as="button"
        type="button"
        $primary
        aria-haspopup="dialog"
        onClick={open}
      >
        <FiShare2 aria-hidden="true" />
        Ver estrutura
      </ResourceLink>
      <Dialog
        ref={dialog}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={() => {
          setActive(false);
          setExpanded(false);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not(:disabled), a[href], [tabindex="0"], summary',
            ),
          ).filter((element) => element.getClientRects().length > 0);
          const first = items[0];
          const last = items[items.length - 1];
          const current = event.currentTarget.ownerDocument.activeElement;
          if (event.shiftKey && current === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && current === last) {
            event.preventDefault();
            first?.focus();
          }
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
            event.currentTarget.close();
        }}
      >
        <DialogHeader>
          <div>
            <h2 id={titleId}>Estrutura do projeto</h2>
            <p id={descriptionId}>
              Leviatã e o Cativeiro · portal, gestão, dados e integrações.
            </p>
          </div>
          <Close
            type="button"
            aria-label="Fechar estrutura"
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            <FiX aria-hidden="true" />
          </Close>
          <DialogActions>
            <ResourceLink
              as="button"
              type="button"
              disabled={status !== "ready"}
              aria-pressed={expanded}
              onClick={toggleSize}
            >
              {expanded ? (
                <FiMinimize2 aria-hidden="true" />
              ) : (
                <FiMaximize2 aria-hidden="true" />
              )}
              {expanded ? "Ajustar à tela" : "Ampliar imagem"}
            </ResourceLink>
            <ResourceLink
              href={structure}
              download="LEVIATA_ESTRUTURA_DO_PROJETO.png"
            >
              <FiDownload aria-hidden="true" />
              Baixar imagem
            </ResourceLink>
            <ResourceLink
              href={structure}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiExternalLink aria-hidden="true" />
              Abrir imagem
            </ResourceLink>
          </DialogActions>
        </DialogHeader>

        <ImageViewport
          ref={viewport}
          $expanded={expanded}
          aria-label="Imagem da estrutura do projeto"
          aria-busy={active && status === "loading"}
          tabIndex={0}
        >
          {active && (
            <img
              src={structure}
              alt="Arquitetura do Leviatã e o Cativeiro: visitantes e administradores acessam o frontend React na Vercel pelo domínio Registro.br. Portal e admin usam a API NestJS, conectada ao Neon PostgreSQL, ao Cloudinary e ao envio de e-mails. O Observatório consulta analytics próprio; a documentação acompanha o frontend."
              style={{ visibility: status === "ready" ? "visible" : "hidden" }}
              onLoad={() => setStatus("ready")}
              onError={() => setStatus("error")}
            />
          )}
          {active && status !== "ready" && (
            <Feedback role={status === "error" ? "alert" : "status"}>
              {status === "error"
                ? "Não foi possível carregar a estrutura. Tente abrir a imagem em outra aba."
                : "Carregando estrutura do projeto…"}
            </Feedback>
          )}
        </ImageViewport>

        <Description>
          <summary>Descrição da arquitetura</summary>
          <p>
            O Registro.br gerencia o domínio, que aponta para o frontend React
            na Vercel. O portal público e o admin se comunicam com a API NestJS
            por HTTPS. A API autentica usuários, gerencia conteúdo, consulta o
            PostgreSQL no Neon, integra arquivos com o Cloudinary e envia
            newsletters por SMTP/Gmail. A coleta anônima de páginas públicas
            alimenta o analytics próprio no Neon; o Observatório exibe os
            relatórios no admin. A documentação HTML, os manuais e os diagramas
            acompanham o build do frontend.
          </p>
        </Description>
      </Dialog>
    </>
  );
}
