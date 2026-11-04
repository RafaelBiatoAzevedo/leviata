import { useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../hooks/useModal";
import { useToast } from "../../../../hooks/useToast";
import { AdminBadge } from "../../../components/AdminBadge";
import { AdminButton } from "../../../components/AdminButton";
import { AdminError } from "../../../components/AdminError";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminPagination } from "../../../components/AdminPagination";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminTable } from "../../../components/AdminTable";
import type { NewsletterSubscriberDto } from "../../../dtos/newsletter/NewsletterSubscriberDto";
import { useAdminList } from "../../../hooks/useAdminList";
import { newsletterSubscribersService } from "../../../services/newsletterSubscribers";
import { formatDateTime } from "../../../utils/dateTime";
import { newsletterSubscriberError } from "../../../utils/newsletterSubscriber";
import { Actions, Container, Empty, Filters } from "../styles";

export function AdminNewsletterSubscribers() {
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { showToast } = useToast();
  const { items, loading, error, load, pagination } = useAdminList(
    newsletterSubscribersService.getPage,
    { search: search.trim() || undefined, isActive: isActive || undefined },
  );

  function remove(item: NewsletterSubscriberDto) {
    showModal({
      title: "Remover inscrito",
      content: (
        <p>
          Deseja remover <strong>{item.email}</strong> da lista de inscritos?
          Ele deixará de receber as próximas newsletters.
        </p>
      ),
      confirmText: "Remover",
      cancelText: "Cancelar",
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await newsletterSubscribersService.removeById(item.id);
        } catch (error) {
          showToast({
            title: "Erro ao remover inscrito",
            description: newsletterSubscriberError(error),
            type: "danger",
          });
          throw error;
        }
        load();
        showToast({
          title: "Inscrito removido",
          description: item.email,
          type: "success",
        });
      },
    });
  }

  return (
    <Container>
      <AdminPageHeader
        title="Inscritos da newsletter"
        subtitle="Gerencie os inscritos cadastrados pelo portal e pelo painel administrativo."
      >
        <AdminButton
          onClick={() => navigate("/admin/inscritos-newsletter/novo")}
        >
          <FiPlus /> Novo inscrito
        </AdminButton>
      </AdminPageHeader>
      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pesquisar por nome, e-mail ou telefone..."
        />
        <AdminSelect
          label="Status"
          value={isActive}
          onChange={(event) => setIsActive(event.target.value)}
          options={[
            { value: "", label: "Todos os status" },
            { value: "true", label: "Ativos" },
            { value: "false", label: "Inativos" },
          ]}
        />
      </Filters>
      {error && (
        <AdminError>
          {error}
          <AdminButton variant="outline" onClick={load}>
            Tentar novamente
          </AdminButton>
        </AdminError>
      )}
      <AdminTable loading={loading} label="Inscritos da newsletter">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Recebe e-mail</th>
            <th>Inscrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.name || item.email}</strong>
              </td>
              <td>{item.email}</td>
              <td>{item.cellphone || "—"}</td>
              <td>
                <AdminBadge variant={item.isActive ? "success" : "secondary"}>
                  {item.isActive ? "Ativo" : "Inativo"}
                </AdminBadge>
              </td>
              <td>{item.allowEmail ? "Sim" : "Não"}</td>
              <td>{formatDateTime(item.subscribedAt)}</td>
              <td>
                <Actions>
                  <AdminIconButton
                    title="Visualizar"
                    onClick={() =>
                      navigate(`/admin/inscritos-newsletter/${item.id}`)
                    }
                  >
                    <FiEye />
                  </AdminIconButton>
                  <AdminIconButton
                    title="Editar"
                    onClick={() =>
                      navigate(`/admin/inscritos-newsletter/${item.id}/editar`)
                    }
                  >
                    <FiEdit2 />
                  </AdminIconButton>
                  <AdminIconButton
                    title="Remover"
                    variant="danger"
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
      {!loading && !error && items.length === 0 && (
        <Empty>Nenhum inscrito encontrado.</Empty>
      )}
      <AdminPagination {...pagination} />
    </Container>
  );
}
