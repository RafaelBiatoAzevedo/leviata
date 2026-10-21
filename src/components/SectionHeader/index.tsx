import { Container, Ornament, Title, Subtitle } from "./styles";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  small?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function SectionHeader({
  title,
  subtitle,
  center = false,
  small = false,
  as: headingTag = "h1",
}: SectionHeaderProps) {
  return (
    <Container $center={center}>
      <Title as={headingTag} $small={small}>
        {title}
      </Title>
      <Ornament aria-hidden="true" />
      {subtitle?.trim() && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
}
