import { Link } from "react-router-dom";
import { formatDateLong } from "../../admin/utils/formatDate";
import {
  Container,
  Cover,
  Content,
  DateText,
  Title,
  Description,
} from "./styles";

interface NewsCardProps {
  externalUrl: string;
  coverUrl?: string | null;
  date: string;
  title: string;
  slug: string;
  description: string;
  isInternal: boolean;
}

export function NewsCard({
  slug,
  isInternal,
  externalUrl,
  coverUrl,
  date,
  title,
  description,
}: NewsCardProps) {
  return (
    <Container
      as={isInternal ? Link : "a"}
      to={isInternal ? `/noticias/${slug}` : undefined}
      href={!isInternal ? (externalUrl ?? undefined) : undefined}
      target={!isInternal ? "_blank" : undefined}
      rel={!isInternal ? "noopener noreferrer" : undefined}
    >
      {coverUrl ? (
        <Cover>
          <img src={coverUrl} alt={title} />
        </Cover>
      ) : (
        <></>
      )}

      <Content>
        <DateText>{formatDateLong(date)}</DateText>

        <Title>{title}</Title>

        <Description>{description}</Description>
      </Content>
    </Container>
  );
}
