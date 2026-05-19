import { Container, Cover, Content, Title, Author, Year } from "./styles";

interface BookCardProps {
  to: string;
  cover: string;
  title: string;
  author: string;
  year: string | number;
}

export function BookCard({ to, cover, title, author, year }: BookCardProps) {
  return (
    <Container to={to}>
      <Cover>
        <img src={cover} alt={title} />
      </Cover>

      <Content>
        <Title>{title}</Title>

        <Author>{author}</Author>

        <Year>{year}</Year>
      </Content>
    </Container>
  );
}
