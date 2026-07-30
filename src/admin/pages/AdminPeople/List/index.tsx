import { useEffect, useState } from "react";
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
  CategorySelect,
  Avatar,
  Actions,
  Empty,
  AvatarPlaceholder,
} from "./styles";
import { peopleService } from "../../../../services/people";
import { useToast } from "../../../../hooks/useToast";
import type { PersonResponseDto } from "../../../../dto/people/people-response.dto";

//temp
import larrissaImage from "../../../../assets/images/Larissa.webp";

export function AdminPeople() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [people, setPeople] = useState<PersonResponseDto[]>([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  useEffect(() => {
    async function load() {
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
    }

    load();
  }, [showToast]);

  const filteredPeople = people.filter((person) => {
    console.log(people);
    const matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "" || person.category === category;

    return matchesSearch && matchesCategory;
  });

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Deseja realmente excluir este pesquisador?",
    );

    if (!confirmed) return;

    console.log("Excluir:", id);
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

        <CategorySelect
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          ...
        </CategorySelect>
      </Filters>

      <AdminTable>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Instituição</th>
            <th>Ordem</th>
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

                <td>
                  <strong>{person.name}</strong>

                  <br />

                  <small>{person.slug}</small>
                </td>

                <td>{person.category}</td>

                <td>{person.institution?.acronym}</td>

                <td>{person.displayOrder}</td>

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
                      onClick={() => handleDelete(person.id)}
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
