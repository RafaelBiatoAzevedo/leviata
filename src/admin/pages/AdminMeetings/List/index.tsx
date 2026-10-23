import { AdminPagination } from "../../../components/AdminPagination";
import { AdminError } from "../../../components/AdminError";
import { useAdminList } from "../../../hooks/useAdminList";
import { FiEdit2, FiEye, FiPlus, FiTrash2, FiVideo } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import {
  Actions,
  Container,
  Cover,
  CoverPlaceholder,
  DescriptionCell,
  Empty,
  Filters,
} from "./styles";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import type { MeetingResponseDto } from "../../../dtos/meetings/MeetingResponseDto";
import { meetingsService } from "../../../services/meetings";
import { AdminTable } from "../../../components/AdminTable";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import { formatDate } from "../../../utils/formatDate";
import {
  meetingTypeLabels,
  type TMeetingType,
} from "../../../types/TMeetingType";
import { meetingTypeOptions } from "../../../utils/meetingTypes";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminBadge } from "../../../components/AdminBadge";

export function AdminMeetings() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TMeetingType | "">("");
  const [visibility, setVisibility] = useState<"" | "true" | "false">("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const { items, loading, error, load, pagination } = useAdminList(
    meetingsService.getPage,
    {
      search: search.trim() || undefined,
      isInternal: visibility || undefined,
      type: type || undefined,
    },
  );

  function handleDelete(meeting: MeetingResponseDto) {
    showModal({
      title: "Excluir encontro",

      content: <AdminDeleteContent title={meeting.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await meetingsService.removeBySlug(meeting.slug);

        showToast({
          title: "Encontro excluída",
          description: `${meeting.title.toUpperCase()}`,
          type: "success",
        });

        load();
      },

      onCancel: () => {
        console.log("Cancelou");
      },
    });
  }

  return (
    <Container>
      <AdminPageHeader
        title="Encontros"
        subtitle="Gerencie encontros, seminários e mostras de documentários."
      >
        <AdminButton onClick={() => navigate("/admin/encontros/novo")}>
          <FiPlus />
          Novo Encontro
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSelect
          label="Tipo"
          value={type}
          onChange={(event) => setType(event.target.value as TMeetingType | "")}
          options={[{ value: "", label: "Todos" }, ...meetingTypeOptions]}
        />
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar encontros..."
        />
        <AdminSelect
          label="Exibição no portal"
          value={visibility}
          onChange={(event) =>
            setVisibility(event.target.value as "" | "true" | "false")
          }
          options={[
            { value: "", label: "Todos" },
            { value: "true", label: "Internos" },
            { value: "false", label: "Externos" },
          ]}
        />
      </Filters>

      {error && <AdminError>{error}</AdminError>}
      <AdminTable>
        <thead>
          <tr>
            <th>Capa</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Data</th>
            <th>Tipo</th>
            <th>Exibição</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            items.map((meeting) => (
              <tr key={meeting.id}>
                <td>
                  {meeting.coverUrl ? (
                    <Cover src={meeting.coverUrl} alt={meeting.title} />
                  ) : (
                    <CoverPlaceholder>
                      <FiVideo />
                    </CoverPlaceholder>
                  )}
                </td>

                <td>
                  <strong>{meeting.title}</strong>

                  <br />

                  <small>{meeting.slug}</small>
                </td>

                <td>
                  <DescriptionCell>{meeting.description}</DescriptionCell>
                </td>

                <td>{formatDate(meeting.date)}</td>

                <td>{meetingTypeLabels[meeting.type]}</td>

                <td>
                  <AdminBadge
                    variant={meeting.isInternal ? "primary" : "secondary"}
                  >
                    {meeting.isInternal ? "Interno" : "Externo"}
                  </AdminBadge>
                </td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() =>
                        navigate(`/admin/encontros/${meeting.slug}`)
                      }
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/encontros/${meeting.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(meeting)}
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
        <Empty>Nenhum encontro encontrado.</Empty>
      )}
    </Container>
  );
}
