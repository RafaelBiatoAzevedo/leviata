import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FiArrowLeft, FiSave } from "react-icons/fi";

import { AdminInput } from "../../../components/AdminInput";
import { AdminTextarea } from "../../../components/AdminTextarea";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminSwitch } from "../../../components/AdminSwitch";
import { AdminDateInput } from "../../../components/AdminDateInput";
import { AdminImageUpload } from "../../../components/AdminImageUpload";

import { Container, Form, Actions, PersonTopWrappe } from "./styles";

import { personSchema } from "./schema";

import type { PersonFormData } from "./schema";
import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminSection } from "../../../components/AdminSection";

export function PersonForm() {
  const navigate = useNavigate();

  const { slug } = useParams();

  const isEdit = Boolean(slug);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),

    defaultValues: {
      isActive: true,

      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (!isEdit) return;

    async function loadPerson() {
      // TODO:
      // const person = await peopleService.findById(id!)
      // const person = await peopleService.findBySlug(slug!)
      // reset(mapPersonToForm(person))
    }

    loadPerson();
  }, [slug, isEdit, reset]);

  async function onSubmit(data: PersonFormData) {
    try {
      if (isEdit) {
        // await peopleService.update(id!, data);
      } else {
        // await peopleService.create(data);
      }

      navigate("/admin/pessoas");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? "Editar Pessoa" : "Nova Pessoa"}
        subtitle="Cadastre ou atualize os dados da pessoa."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <PersonTopWrappe>
          <AdminFormCard>
            <AdminSection title="Foto">
              <AdminFormGrid columns={1}>
                <AdminImageUpload label="Foto" />
              </AdminFormGrid>
            </AdminSection>
          </AdminFormCard>

          <AdminFormCard>
            <AdminSection title="Dados Gerais">
              <AdminFormGrid>
                <AdminInput label="Nome" placeholder="Nome completo" required />

                <AdminInput label="Slug" placeholder="nome-completo" required />

                <AdminSelect label="Categoria" required>
                  <option value="">Selecione</option>

                  <option value="COORDENADOR">Coordenador</option>

                  <option value="SUB_COORDENADOR">Subcoordenador</option>

                  <option value="DOCENTE">Docente</option>

                  <option value="DISCENTE">Discente</option>

                  <option value="PESQUISADOR">Pesquisador</option>

                  <option value="EGRESSO">Egresso</option>
                </AdminSelect>

                <AdminInput label="Ordem" type="number" defaultValue={0} />

                <AdminSwitch label="Ativo" checked />
              </AdminFormGrid>
            </AdminSection>
          </AdminFormCard>
        </PersonTopWrappe>

        <AdminFormCard>
          <AdminSection title="Dados Pessoais">
            <AdminFormGrid>
              <AdminDateInput label="Nascimento" />

              <AdminInput label="Nacionalidade" placeholder="Ex.: Brasileira" />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Dados Acadêmicos">
            <AdminFormGrid>
              <AdminInput label="Título Acadêmico" placeholder="Ex.: Doutor" />

              <AdminInput label="Instituição" placeholder="Ex.: UNESP" />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Contato">
            <AdminFormGrid>
              <AdminInput
                label="E-mail"
                type="email"
                placeholder="email@exemplo.com"
              />

              <AdminInput
                label="Lattes"
                placeholder="https://lattes.cnpq.br/..."
              />

              <AdminInput label="ORCID" placeholder="0000-0000-0000-0000" />

              <AdminInput
                label="LinkedIn"
                placeholder="https://linkedin.com/in/..."
              />

              <AdminInput label="Website" placeholder="https://..." />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Biografia">
            <AdminFormGrid columns={1}>
              <AdminTextarea
                label="Biografia"
                rows={10}
                placeholder="Escreva uma breve biografia..."
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>

        <Actions>
          <AdminButton
            variant="outline"
            type="button"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
            Cancelar
          </AdminButton>

          <AdminButton type="submit" disabled={isSubmitting}>
            <FiSave />
            Salvar
          </AdminButton>
        </Actions>
      </Form>
    </Container>
  );
}
