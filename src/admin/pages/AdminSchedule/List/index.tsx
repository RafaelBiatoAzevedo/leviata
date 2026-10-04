import { useEffect, useState } from "react";
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
import { Actions, Container, Empty, Pagination } from "./styles";

const pageSize = 10;

export function AdminSchedule() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal } = useModal();
  const [items, setItems] = useState<ScheduleResponseDto[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    scheduleService
      .getAll({ page, limit: pageSize, search: search.trim() || undefined })
      .then(({ data }) => {
        if (!cancelled) {
          setItems(data);
          setError("");
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) setError(scheduleErrorMessage(error));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, refresh]);

  function changePage(next: number) {
    setLoading(true);
    setPage(next);
  }

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
          setLoading(true);
          if (items.length === 1 && page > 1) setPage(page - 1);
          else setRefresh((value) => value + 1);
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
        onChange={(event) => {
          setLoading(true);
          setSearch(event.target.value);
          setPage(1);
        }}
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
      <Pagination>
        <AdminButton
          variant="outline"
          disabled={loading || page === 1}
          onClick={() => changePage(page - 1)}
        >
          Anterior
        </AdminButton>
        <span>Página {page}</span>
        <AdminButton
          variant="outline"
          disabled={loading || Boolean(error) || items.length < pageSize}
          onClick={() => changePage(page + 1)}
        >
          Próxima
        </AdminButton>
      </Pagination>
    </Container>
  );
}
