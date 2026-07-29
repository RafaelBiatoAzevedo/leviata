import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import { AdminBadge } from "../../../components/AdminBadge";
import { AdminButton } from "../../../components/AdminButton";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminFormCard } from "../../../components/AdminFormCard";
//import { AdminImageUpload } from "../../../components/AdminImageUpload";
import { AdminSection } from "../../../components/AdminSection";

import {
  Container,
  Header,
  HeaderActions,
  Title,
  PhotoWrapper,
  Photo,
  Name,
  Subtitle,
} from "./styles";

export function PersonView() {
  const navigate = useNavigate();

  const { slug } = useParams();

  // TODO: buscar da API
  const person = {
    id: "1",
    name: "Ricardo Alexandre Ferreira",
    slug: "ricardo-alexandre-ferreira",
    category: "Docente",
    isActive: true,
    displayOrder: 1,

    birthDate: "15/08/1978",
    nationality: "Brasileiro",

    academicTitle: "Professor Doutor",
    institution: "UNESP",

    email: "ricardo@unesp.br",
    lattes: "https://lattes.cnpq.br/123456",
    orcid: "0000-0002-1234-5678",
    linkedin: "https://linkedin.com/in/ricardo",
    website: "https://ricardo.com",

    biography:
      "Professor do Programa de Pós-Graduação da UNESP. Atua nas áreas de História, Memória e Patrimônio.",

    imageUrl: "",
  };

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton
            onClick={() => navigate(`/admin/pessoas/${person.slug}/editar`)}
          >
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Pessoa</Title>
      </Header>

      <PhotoWrapper>
        <Photo src={person.imageUrl || "https://placehold.co/180x180"} />

        <Name>{person.name}</Name>

        <Subtitle>
          {person.academicTitle} • {person.institution}
        </Subtitle>
      </PhotoWrapper>

      <AdminFormCard>
        <AdminSection title="Dados Gerais">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Nome" value={person.name} />

            <AdminDescriptionItem label="Slug" value={person.slug} />

            <AdminDescriptionItem label="Categoria" value={person.category} />

            <AdminDescriptionItem
              label="Status"
              value={
                <AdminBadge variant={person.isActive ? "success" : "danger"}>
                  {person.isActive ? "Ativo" : "Inativo"}
                </AdminBadge>
              }
            />

            <AdminDescriptionItem label="Ordem" value={person.displayOrder} />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Dados Pessoais">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Nascimento" value={person.birthDate} />

            <AdminDescriptionItem
              label="Nacionalidade"
              value={person.nationality}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Dados Acadêmicos">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Título" value={person.academicTitle} />

            <AdminDescriptionItem
              label="Instituição"
              value={person.institution}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Contato">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Email" value={person.email} />

            <AdminDescriptionItem label="Lattes" value={person.lattes} />

            <AdminDescriptionItem label="ORCID" value={person.orcid} />

            <AdminDescriptionItem label="LinkedIn" value={person.linkedin} />

            <AdminDescriptionItem label="Website" value={person.website} />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Biografia">
          <AdminDescriptionList columns={1}>
            <AdminDescriptionItem label="Biografia" value={person.biography} />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}
