import {
  Container,
  ProfileImage,
  Content,
  Name,
  Description,
  Category,
} from "./styles";

// export const TITLES = [
//   "Prof,",
//   "Profa.",
//   "Me.",
//   "Ma.",
//   "Dr.",
//   "Dra.",
//   "Prof. Me.",
//   "Profa. Ma.",
//   "Prof. Dr.",
//   "Profa. Dra.",
//   "Doutorando(a)",
//   "Mestrando(a)",
//   "Graduando(a)",
// ];

// Professor
// Professora
// Mestre
// Mestra
// Doutor
// Doutora
// Doutorando(a)
// Mestrando(a)
// Graduando(a)

// const CATEGORIES: "docente" | "discente" | "egresso" | "pesquisador" | "coordenador";

interface PersonCardProps {
  image: string;
  name: string;
  title?: string;
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
