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
import type { PresentedWorkResponseDto } from "../../../dtos/presentedWorks/PresentedWorkResponseDto";
import { formatDate } from "../../../utils/formatDate";
import { presentedWorksService } from "../../../services/presentedWorks";

export function AdminPresentedWorks() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const [loading, setLoading] = useState(true);

  const [presentedWorks, setPresentedWorks] = useState<
    PresentedWorkResponseDto[]
  >([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await presentedWorksService.getAll();

      setPresentedWorks(response.data);
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

  const filteredPresentedWorks = presentedWorks.filter((presentedWork) => {
    const matchesSearch =
      presentedWork.title.toLowerCase().includes(search.toLowerCase()) ||
      presentedWork.slug.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  function handleDelete(presentedWork: PresentedWorkResponseDto) {
    showModal({
      title: "Exclur apresentação",

      content: <AdminDeleteContent title={presentedWork.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await presentedWorksService.removeBySlug(presentedWork.slug);

        showToast({
          title: "Banca excluído",
          description: `${presentedWork.title.toUpperCase()}`,
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
        title="Apresentações de trabalhos"
        subtitle="Gerencie as apresentações cadastradas."
      >
        <AdminButton
          onClick={() => navigate("/admin/apresentacoes-trabalhos/novo")}
        >
          <FiPlus />
          Nova Apresentação
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar apresentações..."
        />
      </Filters>

      <AdminTable>
        <thead>
          <tr>
            <th>Título</th>
            <th>Data</th>
            <th>Local</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            filteredPresentedWorks.map((presentedWork) => (
              <tr key={presentedWork.id}>
                <td>
                  <strong>{presentedWork.title}</strong>

                  <br />

                  <small>{presentedWork.slug}</small>
                </td>
                <td>{formatDate(presentedWork.date)}</td>

                <td>{presentedWork.location}</td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() =>
                        navigate(
                          `/admin/apresentacoes-trabalhos/${presentedWork.slug}`,
                        )
                      }
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(
                          `/admin/apresentacoes-trabalhos/${presentedWork.slug}/editar`,
                        )
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(presentedWork)}
                    >
                      <FiTrash2 />
                    </AdminIconButton>
                  </Actions>
                </td>
              </tr>
            ))}
        </tbody>
      </AdminTable>

      {!loading && filteredPresentedWorks.length === 0 && (
        <Empty>Nenhum banca encontrada.</Empty>
      )}
    </Container>
  );
}
