import { Container, Cover, Content, Title, Author, Year } from "./styles";

interface BookCardProps {
  externalUrl: string;
  coverUrl: string;
  title: string;
  authors: { name: string }[];
  year: string | number;
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
          <Author key={index}>{author.name}</Author>
        ))}

        <Year>{year}</Year>
      </Content>
    </Container>
  );
}
