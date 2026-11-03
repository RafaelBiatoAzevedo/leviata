import { useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../hooks/useModal";
import { useToast } from "../../../../hooks/useToast";
import { useAdminData } from "../../../hooks/useAdminData";
import { useAdminList } from "../../../hooks/useAdminList";
import type { InstitutionResponseDto } from "../../../dtos/InstitutionResponseDto";
import { institutionService } from "../../../services/institution";
import { institutionErrorMessage } from "../../../utils/institution";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminButton } from "../../../components/AdminButton";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminTable } from "../../../components/AdminTable";
import { AdminPagination } from "../../../components/AdminPagination";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import { AdminError } from "../../../components/AdminError";
import { Actions, Container, Empty, Filters } from "../styles";

export function AdminInstitutions() {
  const [search, setSearch] = useState("");
  const [countryId, setCountryId] = useState("");
  const { countries, reloadInstitutions } = useAdminData();
  const { showModal } = useModal();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { items, loading, error, load, pagination } = useAdminList(
    institutionService.getPage,
    {
      search: search.trim() || undefined,
      countryId: countryId || undefined,
    },
  );

  function remove(item: InstitutionResponseDto) {
    showModal({
      title: "Excluir instituição",
      content: <AdminDeleteContent title={item.name} />,
      confirmText: "Excluir",
      cancelText: "Cancelar",
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await institutionService.removeById(item.id);
        } catch (error) {
          showToast({
            title: "Erro ao excluir instituição",
            description: institutionErrorMessage(error),
            type: "danger",
          });
          throw error;
        }
        load();
        try {
          await reloadInstitutions();
        } catch {
          showToast({
            title: "Lista de instituições desatualizada",
            description:
              "A exclusão foi concluída. Recarregue a página para atualizar as opções dos formulários.",
            type: "warning",
          });
        }
        showToast({
          title: "Instituição excluída",
          description: item.name,
          type: "success",
        });
      },
    });
  }

  return (
    <Container>
      <AdminPageHeader
        title="Instituições"
        subtitle="Gerencie as instituições e seus países de origem."
      >
        <AdminButton onClick={() => navigate("/admin/instituicoes/novo")}>
          <FiPlus />
          Nova instituição
        </AdminButton>
      </AdminPageHeader>
      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pesquisar por nome ou sigla..."
        />
        <AdminSelect
          label="País"
          value={countryId}
          onChange={(event) => setCountryId(event.target.value)}
          options={[
            { value: "", label: "Todos os países" },
            ...countries.map((country) => ({
              value: country.id,
              label: country.name,
            })),
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
      <AdminTable loading={loading}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sigla</th>
            <th>País</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.name}</strong>
              </td>
              <td>{item.acronym}</td>
              <td>{item.country?.name ?? "Não informado"}</td>
              <td>
                <Actions>
                  <AdminIconButton
                    title="Visualizar"
                    onClick={() => navigate(`/admin/instituicoes/${item.id}`)}
                  >
                    <FiEye />
                  </AdminIconButton>
                  <AdminIconButton
                    title="Editar"
                    onClick={() =>
                      navigate(`/admin/instituicoes/${item.id}/editar`)
                    }
                  >
                    <FiEdit2 />
                  </AdminIconButton>
                  <AdminIconButton
                    title="Excluir"
                    permission="delete"
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
        <Empty>Nenhuma instituição encontrada.</Empty>
      )}
      <AdminPagination {...pagination} />
    </Container>
  );
}
