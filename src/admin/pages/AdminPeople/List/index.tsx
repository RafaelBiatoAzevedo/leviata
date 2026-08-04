import { useCallback, useEffect, useMemo, useState } from "react";
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

//temp
import larrissaImage from "../../../../assets/images/Larissa.webp";
import { AdminSelect } from "../../../components/AdminSelect";
import { personCategoryOptions } from "../../../utils/personCategory";
import type { PersonResponseDto } from "../../../dto/people/people-response.dto";

export function AdminPeople() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const [loading, setLoading] = useState(true);

  const [people, setPeople] = useState<PersonResponseDto[]>([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await peopleService.getAll();

      const mockImageData = response.data.reduce<PersonResponseDto[]>(
        (array, person) => {
          if (person.slug === "larissa-biato") {
            array.push({
              ...person,
              imageUrl: larrissaImage,
            });
          } else {
            array.push(person);
          }

          return array;
        },
        [],
      );

      setPeople(mockImageData || ([] as PersonResponseDto[]));
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

  const personCategoriesFilterOptions = [
    { value: "", label: "Todas" },
    ...personCategoryOptions,
  ];

  const filteredPeople = people.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "" || person.category === category;

    return matchesSearch && matchesCategory;
  });

  function handleDelete(user: PersonResponseDto) {
    showModal({
      title: "Excluir pessoa",

      content: (
        <div style={{ padding: "2rem 0rem" }}>
          <p>
            Tem certeza que deseja excluir <b>{user.name} ?</b>
          </p>
          <br />
          <p>
            <strong>Esta ação não poderá ser desfeita.</strong>
          </p>
        </div>
      ),

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await peopleService.removeBySlug(user.slug);

        showToast({
          title: "Pessoa excluída",
          description: `${user.name.toUpperCase()}`,
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
        title="Pessoas"
        subtitle="Gerencie as pessoas cadastradas no portal."
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
            filteredPeople.map((person) => (
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

      {!loading && filteredPeople.length === 0 && (
        <Empty>Nenhum pesquisador encontrado.</Empty>
      )}
    </Container>
  );
}
