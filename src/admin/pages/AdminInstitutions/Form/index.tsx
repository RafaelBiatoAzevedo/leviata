import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useAdminData } from "../../../hooks/useAdminData";
import { institutionService } from "../../../services/institution";
import { countryService } from "../../../services/country";
import type { CountryResponseDto } from "../../../dtos/CountryResponseDto";
import {
  institutionSchema,
  type InstitutionFormData,
} from "../../../validations/institution.schema";
import { institutionErrorMessage } from "../../../utils/institution";
import { AdminInput } from "../../../components/AdminInput";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminSection } from "../../../components/AdminSection";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminError } from "../../../components/AdminError";
import { AdminButton } from "../../../components/AdminButton";
import AdminFormActions from "../../../components/AdminFormActions";
import { Container, Form } from "../styles";

export function InstitutionForm() {
  const { id } = useParams();
  return <InstitutionEditor key={id ?? "new"} id={id} />;
}

function InstitutionEditor({ id }: { id?: string }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { reloadInstitutions } = useAdminData();
  const [countries, setCountries] = useState<CountryResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [revision, setRevision] = useState(0);
  const saving = useRef(false);
  const alive = useRef(true);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InstitutionFormData>({
    resolver: zodResolver(institutionSchema),
    defaultValues: { name: "", acronym: "", countryId: "" },
  });

  useEffect(() => {
    const controller = new AbortController();
    alive.current = true;
    Promise.all([
      countryService.getAll(controller.signal),
      id
        ? institutionService.getById(id, controller.signal)
        : Promise.resolve(null),
    ])
      .then(([countryResponse, institutionResponse]) => {
        if (controller.signal.aborted) return;
        setCountries(countryResponse.data);
        if (institutionResponse) {
          const { name, acronym, countryId } = institutionResponse.data;
          reset({ name, acronym, countryId });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setLoadError(institutionErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      alive.current = false;
      controller.abort();
    };
  }, [id, reset, revision]);

  async function onSubmit(data: InstitutionFormData) {
    if (saving.current || loading || loadError) return;
    saving.current = true;
    try {
      if (id) await institutionService.updateById(id, data);
      else await institutionService.create(data);
      try {
        await reloadInstitutions();
      } catch {
        if (alive.current)
          showToast({
            title: "Lista de instituições desatualizada",
            description:
              "A instituição foi salva. Recarregue a página para atualizar as opções dos formulários.",
            type: "warning",
          });
      }
      if (!alive.current) return;
      showToast({
        title: id ? "Instituição atualizada" : "Instituição cadastrada",
        description: "Os dados foram salvos com sucesso.",
        type: "success",
      });
      navigate("/admin/instituicoes");
    } catch (error) {
      if (!alive.current) return;
      const message = institutionErrorMessage(error);
      setError("root.server", { type: "server", message });
      showToast({
        title: "Erro ao salvar instituição",
        description: message,
        type: "danger",
      });
    } finally {
      saving.current = false;
    }
  }

  if (loading)
    return <AdminLoading text="Carregando dados da instituição..." />;
  if (loadError)
    return (
      <Container>
        <AdminError>{loadError}</AdminError>
        <AdminButton
          onClick={() => {
            setLoading(true);
            setLoadError("");
            setRevision((value) => value + 1);
          }}
        >
          Tentar novamente
        </AdminButton>
        <AdminButton
          variant="outline"
          onClick={() => navigate("/admin/instituicoes")}
        >
          Voltar
        </AdminButton>
      </Container>
    );

  return (
    <Container>
      <AdminPageHeader
        title={id ? "Editar instituição" : "Nova instituição"}
        subtitle="Cadastre ou atualize o nome, a sigla e o país da instituição."
      />
      <Form onSubmit={(event) => handleSubmit(onSubmit)(event)}>
        <AdminFormCard>
          <AdminSection title="Dados da instituição">
            <AdminFormGrid>
              <AdminInput
                label="Nome"
                placeholder="Nome completo da instituição"
                required
                maxLength={255}
                error={errors.name?.message}
                {...register("name")}
              />
              <AdminInput
                label="Sigla"
                placeholder="Ex.: UNESP"
                required
                maxLength={50}
                error={errors.acronym?.message}
                {...register("acronym")}
              />
              <AdminSelect
                label="País"
                required
                options={[
                  { value: "", label: "Selecione um país" },
                  ...countries.map((country) => ({
                    value: country.id,
                    label: country.name,
                  })),
                ]}
                error={errors.countryId?.message}
                {...register("countryId")}
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>
        {errors.root?.server && (
          <AdminError>{errors.root.server.message}</AdminError>
        )}
        <AdminFormActions isSubmitting={isSubmitting} />
      </Form>
    </Container>
  );
}
