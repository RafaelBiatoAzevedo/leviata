import { Container, Cover, Content, Description, Title } from "./styles";

interface ImageCardProps {
  imageUrl: string;
  title?: string | null;
  description?: string | null;
}

export function ImageCard({ imageUrl, title, description }: ImageCardProps) {
  return (
    <Container>
      <Cover>
        <img
          src={imageUrl}
          alt={title || description || "Foto da galeria"}
          loading="lazy"
        />
      </Cover>

      {(!!title || !!description) && (
        <Content>
          {title && <Title>{title}</Title>}
          {description && <Description>{description}</Description>}
        </Content>
      )}
    </Container>
  );
}
