import { Container, Title, Subtitle } from "./styles";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  small?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  center = false,
  small = false,
}: SectionHeaderProps) {
  return (
    <Container $center={center}>
      <Title $small={small}>{title}</Title>

      <Subtitle>{subtitle}</Subtitle>
    </Container>
  );
}
