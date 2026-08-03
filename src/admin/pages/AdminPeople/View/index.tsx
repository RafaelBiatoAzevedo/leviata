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
import { useEffect, useState } from "react";
import { peopleService } from "../../../services/people";
import type { PersonResponseDto } from "../../../../dto/people/people-response.dto";
import { useToast } from "../../../../hooks/useToast";

export function PersonView() {
  const navigate = useNavigate();

  const { slug } = useParams();

  const { showToast } = useToast();

  const [person, setPerson] = useState<PersonResponseDto | null>(null);

  useEffect(() => {
    async function loadPerson() {
      try {
        const response = await peopleService.getBySlug(slug!);
        setPerson(response.data);
      } catch (error) {
        showToast({
          title: "Ops! Não foi possível carregar a pessoa",
          description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
          type: "danger",
        });
      }
    }

    if (!person) {
      loadPerson();
    }
  }, [person, showToast, slug]);

  if (!person) {
    return <div>Carregando...</div>;
  }

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton
            onClick={() => navigate(`/admin/pessoas/${slug}/editar`)}
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
          {person.academicTitle?.name} • {person.institution?.acronym}
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
              value={person.nationality?.name}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Dados Acadêmicos">
          <AdminDescriptionList>
            <AdminDescriptionItem
              label="Título"
              value={person.academicTitle?.name}
            />

            <AdminDescriptionItem
              label="Instituição"
              value={person.institution?.name}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Contato">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Email" value={person.email} />

            <AdminDescriptionItem label="Lattes" value={person.lattesUrl} />

            <AdminDescriptionItem label="ORCID" value={person.orcid} />

            <AdminDescriptionItem label="LinkedIn" value={person.linkedinUrl} />

            <AdminDescriptionItem label="Website" value={person.website} />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Biografia">
          <AdminDescriptionList columns={1}>
            <AdminDescriptionItem label="Biografia" value={person.bio} />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}
