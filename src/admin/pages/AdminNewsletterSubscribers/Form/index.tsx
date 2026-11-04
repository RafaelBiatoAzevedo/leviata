import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { AdminButton } from "../../../components/AdminButton";
import { AdminError } from "../../../components/AdminError";
import AdminFormActions from "../../../components/AdminFormActions";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminInput } from "../../../components/AdminInput";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSection } from "../../../components/AdminSection";
import { AdminSwitch } from "../../../components/AdminSwitch";
import { newsletterSubscribersService } from "../../../services/newsletterSubscribers";
import { newsletterSubscriberError } from "../../../utils/newsletterSubscriber";
import {
  newsletterSubscriberSchema,
  type NewsletterSubscriberFormData,
} from "../../../validations/newsletterSubscriber.schema";
import { Container, Form } from "../styles";

export function NewsletterSubscriberForm() {
  const { id } = useParams();
  return <SubscriberEditor key={id ?? "new"} id={id} />;
}

function SubscriberEditor({ id }: { id?: string }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(Boolean(id));
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
  } = useForm<NewsletterSubscriberFormData>({
    resolver: zodResolver(newsletterSubscriberSchema),
    defaultValues: {
      name: "",
      email: "",
      cellphone: "",
      isActive: true,
      allowEmail: true,
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    alive.current = true;
    if (id)
      newsletterSubscribersService
        .getById(id, controller.signal)
        .then(({ data }) => {
          if (!controller.signal.aborted)
            reset({
              name: data.name ?? "",
              email: data.email,
              cellphone: data.cellphone ?? "",
              isActive: data.isActive,
              allowEmail: data.allowEmail,
            });
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted)
            setLoadError(newsletterSubscriberError(error));
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    return () => {
      alive.current = false;
      controller.abort();
    };
  }, [id, reset, revision]);

  async function onSubmit(data: NewsletterSubscriberFormData) {
    if (saving.current || loading || loadError) return;
    saving.current = true;
    const body = {
      ...data,
      name: data.name || null,
      cellphone: data.cellphone || null,
    };
    try {
      if (id) await newsletterSubscribersService.updateById(id, body);
      else await newsletterSubscribersService.create(body);
      if (!alive.current) return;
      showToast({
        title: id ? "Inscrito atualizado" : "Inscrito cadastrado",
        description: data.email,
        type: "success",
      });
      navigate("/admin/inscritos-newsletter");
    } catch (error) {
      if (!alive.current) return;
      const message = newsletterSubscriberError(error);
      setError("root.server", { type: "server", message });
      showToast({
        title: "Erro ao salvar inscrito",
        description: message,
        type: "danger",
      });
    } finally {
      saving.current = false;
    }
  }

  if (loading) return <AdminLoading text="Carregando inscrito..." />;
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
          onClick={() => navigate("/admin/inscritos-newsletter")}
        >
          Voltar
        </AdminButton>
      </Container>
    );

  return (
    <Container>
      <AdminPageHeader
        title={id ? "Editar inscrito" : "Novo inscrito"}
        subtitle="Cadastre ou atualize os dados de contato e as preferências de recebimento."
      />
      <Form onSubmit={(event) => handleSubmit(onSubmit)(event)}>
        <AdminFormCard>
          <AdminSection title="Dados do inscrito">
            <AdminFormGrid>
              <AdminInput
                label="Nome"
                autoComplete="name"
                maxLength={255}
                error={errors.name?.message}
                {...register("name")}
              />
              <AdminInput
                label="E-mail"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                error={errors.email?.message}
                {...register("email")}
              />
              <AdminInput
                label="Telefone"
                type="tel"
                autoComplete="tel"
                maxLength={30}
                error={errors.cellphone?.message}
                {...register("cellphone")}
              />
            </AdminFormGrid>
          </AdminSection>
          <AdminSection title="Recebimento">
            <AdminFormGrid>
              <AdminSwitch
                label="Cadastro ativo"
                description="Cadastros inativos ficam fora dos próximos envios."
                {...register("isActive")}
              />
              <AdminSwitch
                label="Receber por e-mail"
                description="Habilite quando o inscrito autorizar o recebimento da newsletter."
                {...register("allowEmail")}
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
