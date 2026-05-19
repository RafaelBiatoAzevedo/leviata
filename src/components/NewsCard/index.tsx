import {
  Container,
  Cover,
  Content,
  DateText,
  Title,
  Description,
} from "./styles";

interface NewsCardProps {
  to: string;
  image: string;
  date: string;
  title: string;
  description: string;
}

export function NewsCard({
  to,
  image,
  date,
  title,
  description,
}: NewsCardProps) {
  return (
    <Container to={to}>
      <Cover>
        <img src={image} alt={title} />
      </Cover>

      <Content>
        <DateText>{date}</DateText>

        <Title>{title}</Title>

        <Description>{description}</Description>
      </Content>
    </Container>
  );
}
