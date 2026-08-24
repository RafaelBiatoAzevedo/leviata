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
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import type { MeetingResponseDto } from "../../../dtos/meetings/MeetingResponseDto";
import { meetingsService } from "../../../services/meetings";
import { AdminTable } from "../../../components/AdminTable";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";

export function AdminMeetings() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const [loading, setLoading] = useState(true);

  const [meetings, setMeetings] = useState<MeetingResponseDto[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await meetingsService.getAll();

      setMeetings(response.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: "Ops! Lista não atualizada",
        description: `Não foi possível atualizar a lista.\n${message}`,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(search.toLowerCase()) ||
      meeting.slug.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  function handleDelete(meeting: MeetingResponseDto) {
    showModal({
      title: "Excluir reunião",

      content: <AdminDeleteContent title={meeting.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await meetingsService.removeBySlug(meeting.slug);

        showToast({
          title: "Reunião excluída",
          description: `${meeting.title.toUpperCase()}`,
          type: "success",
        });

        await load();
      },

      onCancel: () => {
        console.log("Cancelou");
      },
    });
  }

  return (
    <Container>
      <AdminPageHeader
        title="Reuniões"
        subtitle="Gerencie os reuniões cadastrados."
      >
        <AdminButton onClick={() => navigate("/admin/reuniões/novo")}>
          <FiPlus />
          Nova Reunião
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar reuniões..."
        />
      </Filters>

      <AdminTable>
        <thead>
          <tr>
            <th>Capa</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ano</th>
            <th>Publicação</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            filteredMeetings.map((meeting) => (
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

                <td>{meeting.date}</td>

                <td>{meeting.location}</td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() =>
                        navigate(`/admin/reuniões/${meeting.slug}`)
                      }
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/reuniões/${meeting.slug}/editar`)
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

      {!loading && filteredMeetings.length === 0 && (
        <Empty>Nenhum livro encontrado.</Empty>
      )}
    </Container>
  );
}
