import { Container, ProfileImage, Content, Name, Description } from "./styles";

interface PersonCardProps {
  image: string;
  name: string;
  description: string;
}

export function PersonCard({ image, name, description }: PersonCardProps) {
  return (
    <Container>
      <ProfileImage>
        <img src={image} alt={name} />
      </ProfileImage>

      <Content>
        <Name>{name}</Name>

        <Description>{description}</Description>
      </Content>
    </Container>
  );
}
