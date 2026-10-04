import { AdminPagination } from "../../../components/AdminPagination";
import { AdminError } from "../../../components/AdminError";
import { useAdminList } from "../../../hooks/useAdminList";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { Actions, Container, DescriptionCell, Empty, Filters } from "./styles";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import type { ResearchInstrumentResponseDto } from "../../../dtos/researchInstruments/ResearchInstrumentResponseDto";
import { researchInstrumentsService } from "../../../services/researchInstruments";
import { AdminTable } from "../../../components/AdminTable";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";

export function AdminResearchInstruments() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const { items, loading, error, load, pagination } = useAdminList(
    researchInstrumentsService.getPage,
    { search: search.trim() || undefined },
  );

  function handleDelete(researchInstrument: ResearchInstrumentResponseDto) {
    showModal({
      title: "Excluir instrumento de pesquisa",

      content: <AdminDeleteContent title={researchInstrument.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await researchInstrumentsService.removeBySlug(researchInstrument.slug);

        showToast({
          title: "Instrumento de Pesquisa excluído",
          description: `${researchInstrument.title.toUpperCase()}`,
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
        title="Instrumento de Pesquisas"
        subtitle="Gerencie os instrumentos pesquisas cadastrados."
      >
        <AdminButton
          onClick={() => navigate("/admin/instrumentos-pesquisa/novo")}
        >
          <FiPlus />
          Novo Instrumento de Pesquisa
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar instrumento de pesquisas..."
        />
      </Filters>

      {error && <AdminError>{error}</AdminError>}
      <AdminTable>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>Ano Inicial</th>
            <th>Ano Final</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            items.map((researchInstrument) => (
              <tr key={researchInstrument.id}>
                <td>
                  <strong>{researchInstrument.title}</strong>

                  <br />

                  <small>{researchInstrument.slug}</small>
                </td>

                <td>
                  <DescriptionCell>
                    {researchInstrument.content}
                  </DescriptionCell>
                </td>

                <td>{researchInstrument.startYear}</td>

                <td>{researchInstrument.endYear}</td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() =>
                        navigate(
                          `/admin/instrumentos-pesquisa/${researchInstrument.slug}`,
                        )
                      }
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(
                          `/admin/instrumentos-pesquisa/${researchInstrument.slug}/editar`,
                        )
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(researchInstrument)}
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
        <Empty>Nenhum instrumento de pesquisa encontrado.</Empty>
      )}
    </Container>
  );
}
