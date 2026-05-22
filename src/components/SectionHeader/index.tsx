import { Container, Title, Subtitle } from "./styles";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  center = false,
}: SectionHeaderProps) {
  return (
    <Container $center={center}>
      <Title>{title}</Title>

      <Subtitle>{subtitle}</Subtitle>
    </Container>
  );
}
