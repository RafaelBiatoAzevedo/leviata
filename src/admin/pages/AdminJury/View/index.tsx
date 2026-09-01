import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import {
  BookTitle,
  Container,
  ContentWrapper,
  Cover,
  CoverWrapper,
  Header,
  HeaderActions,
  Subtitle,
  Title,
} from "./styles";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { booksService } from "../../../services/books";
import { useToast } from "../../../../hooks/useToast";
import type { BookResponseDto } from "../../../dtos/books/BookResponseDto";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminLoading } from "../../../components/AdminLoading";

export function JuryView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [book, setBook] = useState<BookResponseDto | null>(null);

  const loadBook = useCallback(async () => {
    try {
      const response = await booksService.getBySlug(slug!);
      setBook(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar o livro",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!book) {
      (async () => {
        await loadBook();
      })();
    }
  }, [book, loadBook]);

  if (!book) {
    return <AdminLoading text="Carregando livro..." />;
  }

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton onClick={() => navigate(`/admin/livros/${slug}/editar`)}>
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Livro</Title>
      </Header>

      <ContentWrapper>
        <CoverWrapper to={book.externalUrl} target={"_blank"}>
          <Cover src={book.coverUrl} />

          <BookTitle>{book.title}</BookTitle>

          <Subtitle>{book.year}</Subtitle>
        </CoverWrapper>

        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminDescriptionList>
              <AdminDescriptionItem label="Título" value={book.title} />

              <AdminDescriptionItem label="Slug" value={book.slug} />

              <AdminDescriptionItem label="Subtítulo" value={book.subtitle} />

              <AdminDescriptionItem label="Isbn" value={book.isbn} />

              <AdminDescriptionItem label="Ano" value={book.year} />

              <AdminDescriptionItem label="Editora" value={book.publisher} />

              <AdminDescriptionItem label="Link" value={book.externalUrl} />
            </AdminDescriptionList>
          </AdminSection>
        </AdminFormCard>
      </ContentWrapper>
      <AdminFormCard>
        <AdminSection title="Descrição">
          <AdminDescriptionItem label="Descrição" value={book.description} />
        </AdminSection>
      </AdminFormCard>
      <AdminFormCard>
        <AdminSection
          title={`${book.authors.length > 1 ? "Autores" : "Autor"}`}
        >
          {book.authors.map((author, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${author.academicTitle!.abbreviation} ${author.name} - ${author.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}
