import type { FC } from "react";

import {
  Container,
  Avatar,
  Content,
  Name,
  Subtitle,
  Text,
  AvatarPlaceholder,
} from "./styles";
import { FiUser } from "react-icons/fi";

interface ITestimonyCardProps {
  image?: string;
  name: string;
  subtitle?: string;
  text: string;
}

export const TestimonyCard: FC<ITestimonyCardProps> = ({
  image,
  name,
  subtitle,
  text,
}) => {
  return (
    <Container>
      {image ? (
        <Avatar src={image} alt={name} />
      ) : (
        <AvatarPlaceholder>
          <FiUser />
        </AvatarPlaceholder>
      )}

      <Content>
        <Name>{name}</Name>

        {!!subtitle && <Subtitle>{subtitle}</Subtitle>}

        <Text>"{text}"</Text>
      </Content>
    </Container>
  );
};
