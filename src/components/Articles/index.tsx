import {
  Container,
  Cover,
  Content,
  Journal,
  Title,
  Author,
  Footer,
  Year,
  ReadMore,
} from "./styles";

interface IArticleCardProps {
  title: string;
  author: string;
  journal: string;
  volume: string;
  year: string;
  cover: string;
  to: string;
}

export function ArticleCard({
  title,
  author,
  journal,
  volume,
  year,
  cover,
  to,
}: IArticleCardProps) {
  return (
    <Container to={to} target="_blank">
      <Cover>
        <img src={cover} alt={title} />
      </Cover>

      <Content>
        <Journal>
          {journal}

          <span>{volume}</span>
        </Journal>

        <Title>{title}</Title>

        <Author>{author}</Author>

        <Footer>
          <Year>{year}</Year>

          <ReadMore>Acessar artigo</ReadMore>
        </Footer>
      </Content>
    </Container>
  );
}
