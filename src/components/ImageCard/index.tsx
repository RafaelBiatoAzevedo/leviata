import { Container, Cover, Content, Description, Title } from "./styles";

interface ImageCardProps {
  imageUrl: string;
  title?: string | null;
  description?: string | null;
}

export function ImageCard({ imageUrl, title, description }: ImageCardProps) {
  const captionTitle = title?.trim();
  const captionDescription = description?.trim();
  return (
    <Container>
      <Cover>
        <img
          src={imageUrl}
          alt={captionTitle || captionDescription || "Foto da galeria"}
          loading="lazy"
        />
      </Cover>

      {(captionTitle || captionDescription) && (
        <Content>
          {captionTitle && <Title>{captionTitle}</Title>}
          {captionDescription && (
            <Description>{captionDescription}</Description>
          )}
        </Content>
      )}
    </Container>
  );
}
