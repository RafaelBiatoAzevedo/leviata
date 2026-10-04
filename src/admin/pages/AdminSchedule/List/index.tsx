import { AdminPagination } from "../../../components/AdminPagination";
import { useAdminList } from "../../../hooks/useAdminList";
import { useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../hooks/useModal";
import { useToast } from "../../../../hooks/useToast";
import { AdminButton } from "../../../components/AdminButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import { AdminError } from "../../../components/AdminError";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { AdminTable } from "../../../components/AdminTable";
import type { ScheduleResponseDto } from "../../../dtos/schedule/ScheduleResponseDto";
import { scheduleService } from "../../../services/schedule";
import {
  formatScheduleDate,
  scheduleErrorMessage,
} from "../../../utils/schedule";
import { Actions, Container, Empty } from "./styles";

export function AdminSchedule() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal } = useModal();
  const [search, setSearch] = useState("");
  const { items, loading, error, load, pagination } = useAdminList(
    scheduleService.getPage,
    {
      search: search.trim() || undefined,
    },
  );

  function handleDelete(item: ScheduleResponseDto) {
    showModal({
      title: "Excluir evento",
      content: <AdminDeleteContent title={item.title} />,
      confirmText: "Excluir",
      cancelText: "Cancelar",
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await scheduleService.removeBySlug(item.slug);
          showToast({
            title: "Evento excluído",
            description: item.title,
            type: "success",
          });
          load();
        } catch (error) {
          showToast({
            title: "Erro ao excluir evento",
            description: scheduleErrorMessage(error),
            type: "danger",
          });
          throw error;
        }
      },
    });
  }

  return (
    <Container>
      <AdminPageHeader title="Agenda" subtitle="Gerencie os eventos da agenda.">
        <AdminButton onClick={() => navigate("/admin/agenda/novo")}>
          <FiPlus />
          Novo evento
        </AdminButton>
      </AdminPageHeader>
      <AdminSearchBar
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Pesquisar por título, subtítulo ou local..."
      />
      {loading ? (
        <AdminLoading text="Carregando agenda..." />
      ) : error ? (
        <AdminError>{error}</AdminError>
      ) : (
        <>
          <AdminTable>
            <thead>
              <tr>
                <th>Título</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Local</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <br />
                    <small>{item.slug}</small>
                  </td>
                  <td>{formatScheduleDate(item.date)}</td>
                  <td>{formatScheduleDate(item.endDate)}</td>
                  <td>{item.location || "—"}</td>
                  <td>
                    <Actions>
                      <AdminIconButton
                        title="Visualizar"
                        onClick={() => navigate(`/admin/agenda/${item.slug}`)}
                      >
                        <FiEye />
                      </AdminIconButton>
                      <AdminIconButton
                        title="Editar"
                        onClick={() =>
                          navigate(`/admin/agenda/${item.slug}/editar`)
                        }
                      >
                        <FiEdit2 />
                      </AdminIconButton>
                      <AdminIconButton
                        title="Excluir"
                        onClick={() => handleDelete(item)}
                      >
                        <FiTrash2 />
                      </AdminIconButton>
                    </Actions>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
          {items.length === 0 && <Empty>Nenhum evento encontrado.</Empty>}
        </>
      )}
      <AdminPagination {...pagination} />
    </Container>
  );
}
