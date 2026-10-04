import { AdminPagination } from "../../../components/AdminPagination";
import { AdminError } from "../../../components/AdminError";
import { useAdminList } from "../../../hooks/useAdminList";
import { FiBook, FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import type { BookResponseDto } from "../../../dtos/books/BookResponseDto";
import { booksService } from "../../../services/books";
import { AdminTable } from "../../../components/AdminTable";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";

export function AdminBooks() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const { items, loading, error, load, pagination } = useAdminList(
    booksService.getPage,
    { search: search.trim() || undefined },
  );

  function handleDelete(book: BookResponseDto) {
    showModal({
      title: "Excluir livro",

      content: <AdminDeleteContent title={book.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await booksService.removeBySlug(book.slug);

        showToast({
          title: "Livro excluído",
          description: `${book.title.toUpperCase()}`,
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
        title="Livros"
        subtitle="Gerencie os livros cadastrados."
      >
        <AdminButton onClick={() => navigate("/admin/livros/novo")}>
          <FiPlus />
          Novo Livro
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar livros..."
        />
      </Filters>

      {error && <AdminError>{error}</AdminError>}
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
            items.map((book) => (
              <tr key={book.id}>
                <td>
                  {book.coverUrl ? (
                    <Cover src={book.coverUrl} alt={book.title} />
                  ) : (
                    <CoverPlaceholder>
                      <FiBook />
                    </CoverPlaceholder>
                  )}
                </td>

                <td>
                  <strong>{book.title}</strong>

                  <br />

                  <small>{book.slug}</small>
                </td>

                <td>
                  <DescriptionCell>{book.description}</DescriptionCell>
                </td>

                <td>{book.year}</td>

                <td>{book.publisher}</td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() => navigate(`/admin/livros/${book.slug}`)}
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/livros/${book.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(book)}
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
        <Empty>Nenhum livro encontrado.</Empty>
      )}
    </Container>
  );
}
