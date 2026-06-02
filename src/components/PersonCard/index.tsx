import {
  Container,
  ProfileImage,
  Content,
  Name,
  Description,
  Category,
} from "./styles";

// export const TITLES = [
//   "Prof. Dr.",
//   "Profa. Dra.",
//   "Dr.",
//   "Dra.",
//   "Prof. Me.",
//   "Profa. Ma.",
//   "Me.",
//   "Ma.",
//   "Doutorando(a)",
//   "Mestrando(a)",
//   "Graduando(a)",
//   "Pesquisador(a)",
// ];

// const CATEGORIES: "docente" | "discente" | "egresso" | "pesquisador" | "coordenador";

interface PersonCardProps {
  image: string;
  title?: string;
  name: string;
  category?: string;
  institution?: string;
  bio?: string;
  link?: string;
}

export function PersonCard({
  image,
  name,
  title,
  institution,
  bio,
  category,
  link,
}: PersonCardProps) {
  return (
    <Container to={link ? link : ""} target="_blank">
      <ProfileImage>
        <img src={image} alt={name} />
      </ProfileImage>

      <Content>
        <Name>{`${title ? title : ""} ${name}`}</Name>
        {!!category && <Category>{category}</Category>}

        {!!bio && <Description>{bio}</Description>}

        {!!institution && <Category>{institution}</Category>}
      </Content>
    </Container>
  );
}
