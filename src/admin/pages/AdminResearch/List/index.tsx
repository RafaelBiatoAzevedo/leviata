import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";

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
import type { SearchResponseDto } from "../../../dtos/research/SearchResponseDto";
import { researchService } from "../../../services/research";
import { AdminTable } from "../../../components/AdminTable";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import { TbFolderSearch } from "react-icons/tb";

export function AdminResearch() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const [loading, setLoading] = useState(true);

  const [research, setResearch] = useState<SearchResponseDto[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await researchService.getAll();

      setResearch(response.data);
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

  const filteredResearch = research.filter((_search) => {
    const matchesSearch =
      _search.title.toLowerCase().includes(search.toLowerCase()) ||
      _search.slug.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  function handleDelete(search: SearchResponseDto) {
    showModal({
      title: "Excluir pesquisa",

      content: <AdminDeleteContent title={search.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await researchService.removeBySlug(search.slug);

        showToast({
          title: "Pesquisa excluída",
          description: `${search.title.toUpperCase()}`,
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
        title="Pesquisas"
        subtitle="Gerencie as pesquisas cadastrados."
      >
        <AdminButton onClick={() => navigate("/admin/pesquisas/novo")}>
          <FiPlus />
          Nova Pesquisa
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar pesquisas..."
        />
      </Filters>

      <AdminTable>
        <thead>
          <tr>
            <th>Capa</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Ano</th>
            <th>Publicação</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            filteredResearch.map((search) => (
              <tr key={search.id}>
                <td>
                  {search.coverUrl ? (
                    <Cover src={search.coverUrl} alt={search.title} />
                  ) : (
                    <CoverPlaceholder>
                      <TbFolderSearch />
                    </CoverPlaceholder>
                  )}
                </td>

                <td>
                  <strong>{search.title}</strong>

                  <br />

                  <small>{search.slug}</small>
                </td>

                <td>
                  <DescriptionCell>{search.content}</DescriptionCell>
                </td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() =>
                        navigate(`/admin/pesquisas/${search.slug}`)
                      }
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/pesquisas/${search.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(search)}
                    >
                      <FiTrash2 />
                    </AdminIconButton>
                  </Actions>
                </td>
              </tr>
            ))}
        </tbody>
      </AdminTable>

      {!loading && filteredResearch.length === 0 && (
        <Empty>Nenhum pesquisa encontrada.</Empty>
      )}
    </Container>
  );
}
