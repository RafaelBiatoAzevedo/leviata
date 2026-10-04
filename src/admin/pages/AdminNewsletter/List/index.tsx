import { useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../hooks/useModal";
import { useToast } from "../../../../hooks/useToast";
import { AdminButton } from "../../../components/AdminButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import { AdminError } from "../../../components/AdminError";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminPagination } from "../../../components/AdminPagination";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { AdminTable } from "../../../components/AdminTable";
import type { NewsletterResponseDto } from "../../../dtos/newsletter/NewsletterResponseDto";
import { useAdminList } from "../../../hooks/useAdminList";
import { newsletterService } from "../../../services/newsletter";
import { Actions, Container, Empty, Filters } from "./styles";

export function AdminNewsletters() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal } = useModal();
  const { items, loading, error, load, pagination } = useAdminList(
    newsletterService.getPage,
    {
      search: search.trim() || undefined,
    },
  );

  const formatDate = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
          new Date(value),
        )
      : "—";

  function remove(item: NewsletterResponseDto) {
    showModal({
      title: "Excluir newsletter",
      content: <AdminDeleteContent title={item.title} />,
      confirmText: "Excluir",
      cancelText: "Cancelar",
      confirmVariant: "danger",
      onConfirm: async () => {
        await newsletterService.removeBySlug(item.slug);
        showToast({
          title: "Newsletter excluída",
          description: item.title,
          type: "success",
        });
        load();
      },
    });
  }

  return (
    <Container>
      <AdminPageHeader
        title="Newsletters"
        subtitle="Gerencie as newsletters cadastradas."
      >
        <AdminButton onClick={() => navigate("/admin/newsletter/novo")}>
          <FiPlus />
          Nova newsletter
        </AdminButton>
      </AdminPageHeader>
      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pesquisar newsletters..."
        />
      </Filters>
      {error && <AdminError>{error}</AdminError>}
      <AdminTable>
        <thead>
          <tr>
            <th>Título</th>
            <th>Assunto</th>
            <th>Publicação</th>
            <th>Envio</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.title}</strong>
                  <br />
                  <small>{item.slug}</small>
                </td>
                <td>{item.subject}</td>
                <td>{formatDate(item.publishedAt)}</td>
                <td>{formatDate(item.sentAt)}</td>
                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() => navigate(`/admin/newsletter/${item.slug}`)}
                    >
                      <FiEye />
                    </AdminIconButton>
                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/newsletter/${item.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>
                    <AdminIconButton
                      title="Excluir"
                      onClick={() => remove(item)}
                    >
                      <FiTrash2 />
                    </AdminIconButton>
                  </Actions>
                </td>
              </tr>
            ))}
        </tbody>
      </AdminTable>
      <AdminPagination {...pagination} />
      {!loading && !error && items.length === 0 && (
        <Empty>Nenhuma newsletter encontrada.</Empty>
      )}
    </Container>
  );
}
