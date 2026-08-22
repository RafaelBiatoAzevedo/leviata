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
import { useCallback, useEffect, useState } from "react";
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

  const [loading, setLoading] = useState(true);

  const [books, setBooks] = useState<BookResponseDto[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await booksService.getAll();

      setBooks(response.data);
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

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.slug.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

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

      <AdminTable>
        <thead>
          <tr>
            <th>Capa</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ano</th>
            <th>Publicação</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            filteredBooks.map((book) => (
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

      {!loading && filteredBooks.length === 0 && (
        <Empty>Nenhum livro encontrado.</Empty>
      )}
    </Container>
  );
}
