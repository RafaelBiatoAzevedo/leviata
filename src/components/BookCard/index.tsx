import type { Author } from "../../admin/dtos/books/BookResponseDto";
import { Container, Cover, Content, Title, AuthorName, Year } from "./styles";

interface BookCardProps {
  externalUrl: string;
  coverUrl: string;
  title: string;
  authors: Author[];
  year: number;
}

export function BookCard({
  externalUrl,
  coverUrl,
  title,
  authors,
  year,
}: BookCardProps) {
  return (
    <Container to={externalUrl} target="_blank">
      <Cover>
        <img src={coverUrl} alt={title} />
      </Cover>

      <Content>
        <Title>{title}</Title>

        {authors.map((author, index) => (
          <AuthorName key={index}>{author.name}</AuthorName>
        ))}
      </Content>
      <Year>{year}</Year>
    </Container>
  );
}
