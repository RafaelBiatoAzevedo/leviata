import { Container, Cover, Content, Description } from "./styles";

interface ImageCardProps {
  imageUrl: string;
  description?: string;
}

export function ImageCard({ imageUrl, description }: ImageCardProps) {
  return (
    <Container>
      <Cover>
        <img src={imageUrl} alt={description} />
      </Cover>

      {!!description && (
        <Content>
          <Description>{description}</Description>
        </Content>
      )}
    </Container>
  );
}
