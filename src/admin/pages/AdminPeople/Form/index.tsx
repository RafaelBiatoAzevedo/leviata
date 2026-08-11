import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FiArrowLeft, FiSave, FiUser } from "react-icons/fi";

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
import { peopleService } from "../../../services/people";
import {
  personSchema,
  type PersonFormData,
} from "../../../validations/person.schema";
import { mapPersonToForm } from "../../../mappers/person.mapper";
import { personCategoryOptions } from "../../../utils/personCategory";
import { useToast } from "../../../../hooks/useToast";
import { personDefaultValues } from "./defaultValues";
import { useAdminData } from "../../../hooks/useAdminData";
import { toSelectOptions } from "../../../utils/helperSelectOptions";
import { mapPersonToCreateDto } from "../../../mappers/personToCreate.mapper";

export function PersonForm() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const isEdit = Boolean(slug);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { countries, institutions, academicTitles } = useAdminData();

  const countryOptions = toSelectOptions(countries);

  const institutionOptions = toSelectOptions(institutions);

  const academicTitleOptions = toSelectOptions(academicTitles);

  const {
    register,
    handleSubmit,
    reset,
    // watch,
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

      if (response.data.imageUrl) {
        setImagePreview(response.data.imageUrl);
      }

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
        await peopleService.create(mapPersonToCreateDto(data), imageFile!);

        showToast({
          title: "Pessoa criada",
          description: "A pessoa foi cadastrada com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/pessoas");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit ? "Erro ao atualizar pessoa" : "Erro ao criar pessoa",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  async function handleUploadImage(file: File | null) {
    if (!file) return;

    if (isEdit) {
      const response = await peopleService.updateImage(slug!, file);

      setImagePreview(response.data.url);

      setValue("imageUrl", response.data.url);

      showToast({
        title: "Imagem atualizada com sucesso",
        description: "A imagem da pessoa foi atualizada.",
        type: "success",
      });

      return;
    }

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));
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
            <AdminImageUpload
              icon={<FiUser size={42} />}
              label="Foto"
              variant="square"
              imageUrl={imagePreview}
              onChange={handleUploadImage}
            />
          </AdminFormGrid>

          <AdminFormCard>
            <AdminSection title="Dados Gerais">
              <AdminFormGrid>
                <AdminInput
                  label="Nome"
                  placeholder="Nome completo"
                  required
                  error={errors.name?.message}
                  {...register("name")}
                />

                <AdminInput
                  label="Slug (Gerado automaticamente)"
                  value={slug ?? ""}
                  disabled
                />

                <AdminSelect
                  options={personCategoryOptions}
                  label="Categoria"
                  required
                  error={errors.category?.message}
                  {...register("category")}
                ></AdminSelect>

                <AdminInput
                  label="Ordem"
                  type="number"
                  defaultValue={0}
                  {...register("displayOrder")}
                />

                <AdminSwitch label="Ativo" {...register("isActive")} />
              </AdminFormGrid>
            </AdminSection>
          </AdminFormCard>
        </PersonTopWrappe>

        <AdminFormCard>
          <AdminSection title="Dados Pessoais">
            <AdminFormGrid>
              <AdminDateInput label="Nascimento" {...register("birthDate")} />

              <AdminSelect
                label="Nacionalidade"
                options={countryOptions}
                error={errors.nationalityId?.message}
                required
                {...register("nationalityId")}
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Dados Acadêmicos">
            <AdminFormGrid>
              <AdminSelect
                label="Título Acadêmico"
                options={academicTitleOptions}
                required
                error={errors.academicTitleId?.message}
                {...register("academicTitleId")}
              />

              <AdminInput
                label="Título honorífico"
                placeholder="ex: Professor, Prof."
                {...register("honorificTitle")}
              />

              <AdminSelect
                label="Instituição"
                options={institutionOptions}
                error={errors.institutionId?.message}
                required
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
                required
                placeholder="email@exemplo.com"
                error={errors.email?.message}
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
