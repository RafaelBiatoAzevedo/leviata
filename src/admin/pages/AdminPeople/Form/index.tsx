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

import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminSection } from "../../../components/AdminSection";
import { peopleService } from "../../../../services/people";
import {
  personSchema,
  type PersonFormData,
} from "../../../validations/person.schema";
import { mapPersonToForm } from "../../../mappers/person.mapper";
import { personCategoryOptions } from "../../../utils/personCategory";
import { useToast } from "../../../../hooks/useToast";
import { personDefaultValues } from "./defaultValues";

export function PersonForm() {
  const navigate = useNavigate();

  const { slug } = useParams();

  const { showToast } = useToast();

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

    defaultValues: personDefaultValues,
  });

  useEffect(() => {
    if (!isEdit) return;

    async function loadPerson() {
      if (!slug) return;

      const response = await peopleService.getBySlug(slug);
      const formData = mapPersonToForm(response.data);

      reset(formData);
    }

    loadPerson();
  }, [slug, isEdit, reset]);

  async function onSubmit(data: PersonFormData) {
    try {
      if (isEdit) {
        await peopleService.updateBySlug(slug!, data);

        showToast({
          title: "Pessoa atualizada",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await peopleService.create(data);

        showToast({
          title: "Pessoa criada",
          description: "A pessoa foi cadastrada com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/pessoas");
    } catch (error: any) {
      showToast({
        title: isEdit ? "Erro ao atualizar pessoa" : "Erro ao criar pessoa",
        description:
          error.response?.data?.message ??
          "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
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
          <AdminFormGrid columns={1}>
            <AdminImageUpload />
          </AdminFormGrid>

          <AdminFormCard>
            <AdminSection title="Dados Gerais">
              <AdminFormGrid>
                <AdminInput
                  label="Nome"
                  placeholder="Nome completo"
                  required
                  {...register("name")}
                />

                <AdminInput
                  label="Slug"
                  placeholder="nome-completo"
                  required
                  {...register("slug")}
                />

                <AdminSelect
                  options={personCategoryOptions}
                  label="Categoria"
                  required
                  {...register("category")}
                ></AdminSelect>

                <AdminInput
                  label="Ordem"
                  type="number"
                  defaultValue={0}
                  {...register("displayOrder")}
                />

                <AdminSwitch label="Ativo" checked {...register("isActive")} />
              </AdminFormGrid>
            </AdminSection>
          </AdminFormCard>
        </PersonTopWrappe>

        <AdminFormCard>
          <AdminSection title="Dados Pessoais">
            <AdminFormGrid>
              <AdminDateInput label="Nascimento" {...register("birthDate")} />

              <AdminInput
                label="Nacionalidade"
                placeholder="Ex.: Brasileira"
                {...register("nationalityId")}
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Dados Acadêmicos">
            <AdminFormGrid>
              <AdminInput
                label="Título Acadêmico"
                placeholder="Ex.: Doutor"
                {...register("academicTitleId")}
              />

              <AdminInput
                label="Instituição"
                placeholder="Ex.: UNESP"
                {...register("institutionId")}
              />
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
                {...register("email")}
              />

              <AdminInput
                label="Lattes"
                placeholder="https://lattes.cnpq.br/..."
                {...register("lattesUrl")}
              />

              <AdminInput
                label="ORCID"
                placeholder="0000-0000-0000-0000"
                {...register("orcid")}
              />

              <AdminInput
                label="LinkedIn"
                placeholder="https://linkedin.com/in/..."
                {...register("linkedinUrl")}
              />

              <AdminInput
                label="Website"
                placeholder="https://..."
                {...register("website")}
              />
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
                {...register("bio")}
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
