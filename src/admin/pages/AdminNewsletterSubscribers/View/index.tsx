import { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { AdminButton } from "../../../components/AdminButton";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminError } from "../../../components/AdminError";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSection } from "../../../components/AdminSection";
import type { NewsletterSubscriberDto } from "../../../dtos/newsletter/NewsletterSubscriberDto";
import { newsletterSubscribersService } from "../../../services/newsletterSubscribers";
import { formatDateTime } from "../../../utils/dateTime";
import { newsletterSubscriberError } from "../../../utils/newsletterSubscriber";
import { Container, HeaderActions } from "../styles";

export function NewsletterSubscriberView() {
  const { id } = useParams();
  return <SubscriberDetails key={id} id={id!} />;
}

function SubscriberDetails({ id }: { id: string }) {
  const navigate = useNavigate();
  const [item, setItem] = useState<NewsletterSubscriberDto | null>(null);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    newsletterSubscribersService
      .getById(id, controller.signal)
      .then(({ data }) => {
        if (!controller.signal.aborted) setItem(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setError(newsletterSubscriberError(error));
      });
    return () => controller.abort();
  }, [id, revision]);

  if (error)
    return (
      <Container>
        <AdminError>{error}</AdminError>
        <AdminButton
          onClick={() => {
            setError("");
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
  if (!item) return <AdminLoading text="Carregando inscrito..." />;

  return (
    <Container>
      <HeaderActions>
        <AdminButton
          variant="outline"
          onClick={() => navigate("/admin/inscritos-newsletter")}
        >
          <FiArrowLeft /> Voltar
        </AdminButton>
        <AdminButton
          onClick={() => navigate(`/admin/inscritos-newsletter/${id}/editar`)}
        >
          <FiEdit2 /> Editar
        </AdminButton>
      </HeaderActions>
      <AdminPageHeader
        title={item.name || item.email}
        subtitle="Informações do inscrito da newsletter."
      />
      <AdminFormCard>
        <AdminSection title="Dados do inscrito">
          <AdminDescriptionList>
            <AdminDescriptionItem
              label="Nome"
              value={item.name || "Não informado"}
            />
            <AdminDescriptionItem label="E-mail" value={item.email} />
            <AdminDescriptionItem
              label="Telefone"
              value={item.cellphone || "Não informado"}
            />
            <AdminDescriptionItem
              label="Status"
              value={item.isActive ? "Ativo" : "Inativo"}
            />
            <AdminDescriptionItem
              label="Receber por e-mail"
              value={item.allowEmail ? "Sim" : "Não"}
            />
            <AdminDescriptionItem
              label="Inscrito em"
              value={formatDateTime(item.subscribedAt)}
            />
            <AdminDescriptionItem
              label="Cancelamento do recebimento"
              value={
                item.unsubscribedAt ? formatDateTime(item.unsubscribedAt) : "—"
              }
            />
            <AdminDescriptionItem
              label="Criado em"
              value={formatDateTime(item.createdAt)}
            />
            <AdminDescriptionItem
              label="Atualizado em"
              value={formatDateTime(item.updatedAt)}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}
