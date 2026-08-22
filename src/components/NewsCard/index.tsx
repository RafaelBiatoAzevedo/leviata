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
  description: string;
}

export function NewsCard({
  externalUrl,
  coverUrl,
  date,
  title,
  description,
}: NewsCardProps) {
  return (
    <Container to={externalUrl}>
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
