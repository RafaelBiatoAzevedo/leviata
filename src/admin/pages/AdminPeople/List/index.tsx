import { AdminPagination } from "../../../components/AdminPagination";
import { AdminError } from "../../../components/AdminError";
import { useAdminList } from "../../../hooks/useAdminList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FiEdit2, FiEye, FiPlus, FiTrash2, FiUser } from "react-icons/fi";

import { AdminButton } from "../../../components/AdminButton";
import { AdminBadge } from "../../../components/AdminBadge";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { AdminTable } from "../../../components/AdminTable";

import {
  Container,
  Filters,
  Avatar,
  Actions,
  Empty,
  AvatarPlaceholder,
  SelectWrapper,
} from "./styles";
import { peopleService } from "../../../services/people";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";

import { AdminSelect } from "../../../components/AdminSelect";
import { personCategoryOptions } from "../../../utils/personCategory";
import type { PersonResponseDto } from "../../../dtos/people/PersonResponseDto";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";

export function AdminPeople() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const personCategoriesFilterOptions = [
    { value: "", label: "Todas" },
    ...personCategoryOptions,
  ];

  const { items, loading, error, load, pagination } = useAdminList(
    peopleService.getPage,
    { search: search.trim() || undefined, category: category || undefined },
  );

  function handleDelete(person: PersonResponseDto) {
    showModal({
      title: "Excluir pessoa",

      content: <AdminDeleteContent title={person.name} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await peopleService.removeBySlug(person.slug);

        showToast({
          title: "Pessoa excluída",
          description: `${person.name.toUpperCase()}`,
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
        title="Pessoas"
        subtitle="Gerencie as pessoas cadastradas."
      >
        <AdminButton onClick={() => navigate("/admin/pessoas/novo")}>
          <FiPlus />
          Nova Pessoa
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar pessoas..."
        />

        <SelectWrapper>
          <AdminSelect
            onChange={(e) => setCategory(e.target.value)}
            options={personCategoriesFilterOptions}
          ></AdminSelect>
        </SelectWrapper>
      </Filters>

      {error && <AdminError>{error}</AdminError>}
      <AdminTable>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Título</th>
            <th>Nome</th>
            <th>Instituição</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            items.map((person) => (
              <tr key={person.id}>
                <td>
                  {person.imageUrl ? (
                    <Avatar src={person.imageUrl} alt={person.name} />
                  ) : (
                    <AvatarPlaceholder>
                      <FiUser />
                    </AvatarPlaceholder>
                  )}
                </td>

                <td>{person.academicTitle?.name}</td>

                <td>
                  <strong>{person.name}</strong>

                  <br />

                  <small>{person.slug}</small>
                </td>

                <td>{person.institution?.acronym}</td>

                <td>{person.category}</td>

                <td>
                  <AdminBadge variant={person.isActive ? "success" : "danger"}>
                    {person.isActive ? "Ativo" : "Inativo"}
                  </AdminBadge>
                </td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() => navigate(`/admin/pessoas/${person.slug}`)}
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/pessoas/${person.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(person)}
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
        <Empty>Nenhuma pessoa encontrada.</Empty>
      )}
    </Container>
  );
}
