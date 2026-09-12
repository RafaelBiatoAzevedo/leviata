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
import type { ThematicResponseDto } from "../../../dtos/thematics/ThematicResponseDto";
import { thematicsService } from "../../../services/thematics";

export function AdminThematics() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const [loading, setLoading] = useState(true);

  const [thematics, setThematics] = useState<ThematicResponseDto[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await thematicsService.getAll();

      setThematics(response.data);
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

  const filteredThematics = thematics.filter((thematic) => {
    const matchesSearch =
      thematic.title.toLowerCase().includes(search.toLowerCase()) ||
      thematic.slug.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  function handleDelete(thematic: ThematicResponseDto) {
    showModal({
      title: "Excluir temática",

      content: <AdminDeleteContent title={thematic.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await thematicsService.removeBySlug(thematic.slug);

        showToast({
          title: "Temática excluído",
          description: `${thematic.title.toUpperCase()}`,
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
        title="Temáticas"
        subtitle="Gerencie as temáticas cadastradas."
      >
        <AdminButton onClick={() => navigate("/admin/tematicas/novo")}>
          <FiPlus />
          Nova Temática
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar temáticas..."
        />
      </Filters>

      <AdminTable>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Coordenador</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            filteredThematics.map((thematic) => (
              <tr key={thematic.id}>
                <td>
                  <strong>{thematic.title}</strong>

                  <br />

                  <small>{thematic.slug}</small>
                </td>
                <td>{thematic.description}</td>

                <td>{`${thematic.coordinator.academicTitle.abbreviation} ${thematic.coordinator.name}`}</td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() =>
                        navigate(`/admin/tematicas/${thematic.slug}`)
                      }
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/tematicas/${thematic.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(thematic)}
                    >
                      <FiTrash2 />
                    </AdminIconButton>
                  </Actions>
                </td>
              </tr>
            ))}
        </tbody>
      </AdminTable>

      {!loading && filteredThematics.length === 0 && (
        <Empty>Nenhum temática encontrada.</Empty>
      )}
    </Container>
  );
}
