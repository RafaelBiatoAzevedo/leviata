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

import { Container, Form, Actions } from "./styles";

import { personSchema } from "./schema";

import type { PersonFormData } from "./schema";
import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";

export function PersonForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = Boolean(id);

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
      // reset(mapPersonToForm(person))
    }

    loadPerson();
  }, [id, isEdit, reset]);

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
        {/* Vamos montar os campos na próxima etapa */}

        <Actions>
          <AdminButton type="button" onClick={() => navigate(-1)}>
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
