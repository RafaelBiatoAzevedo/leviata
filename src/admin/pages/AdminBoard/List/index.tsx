import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { Actions, Container, Empty, Filters } from "./styles";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import { AdminTable } from "../../../components/AdminTable";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import type { BoardResponseDto } from "../../../dtos/boards/BoardResponseDto";
import { formatDate } from "../../../utils/formatDate";
import { boardsService } from "../../../services/boards";

export function AdminBoards() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const [loading, setLoading] = useState(true);

  const [boards, setBoards] = useState<BoardResponseDto[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await boardsService.getAll();

      setBoards(response.data);
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

  const filteredBoards = boards.filter((board) => {
    const matchesSearch =
      board.title.toLowerCase().includes(search.toLowerCase()) ||
      board.slug.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  function handleDelete(board: BoardResponseDto) {
    showModal({
      title: "Excluir banca",

      content: <AdminDeleteContent title={board.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await boardsService.removeBySlug(board.slug);

        showToast({
          title: "Banca excluído",
          description: `${board.title.toUpperCase()}`,
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
        title="Bancas"
        subtitle="Gerencie as bancas cadastradas."
      >
        <AdminButton onClick={() => navigate("/admin/bancas/novo")}>
          <FiPlus />
          Nova Banca
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar bancas..."
        />
      </Filters>

      <AdminTable>
        <thead>
          <tr>
            <th>Título</th>
            <th>Data</th>
            <th>Candidato</th>
            <th>Orientador</th>
            <th>N° Participantes</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            filteredBoards.map((board) => (
              <tr key={board.id}>
                <td>
                  <strong>{board.title}</strong>

                  <br />

                  <small>{board.slug}</small>
                </td>
                <td>{formatDate(board.date)}</td>

                <td>{board.candidate.name}</td>

                <td>{board.advisor.name}</td>

                <td>{board.members.length}</td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() => navigate(`/admin/bancas/${board.slug}`)}
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/bancas/${board.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(board)}
                    >
                      <FiTrash2 />
                    </AdminIconButton>
                  </Actions>
                </td>
              </tr>
            ))}
        </tbody>
      </AdminTable>

      {!loading && filteredBoards.length === 0 && (
        <Empty>Nenhum banca encontrada.</Empty>
      )}
    </Container>
  );
}
