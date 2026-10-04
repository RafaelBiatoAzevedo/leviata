import { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { usersService } from "../../../services/users";
import type { UserResponseDto } from "../../../dtos/users/UserResponseDto";
import {
  formatUserRole,
  userErrorMessage,
  userName,
} from "../../../utils/users";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminButton } from "../../../components/AdminButton";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminError } from "../../../components/AdminError";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { Container, HeaderActions } from "../styles";

export function UserView() {
  const { id } = useParams();
  return <UserDetails key={id} id={id!} />;
}

function UserDetails({ id }: { id: string }) {
  const navigate = useNavigate();
  const [item, setItem] = useState<UserResponseDto | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    usersService
      .getById(id)
      .then(({ data }) => {
        if (!cancelled) setItem(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) setError(userErrorMessage(error));
      });
    return () => {
      cancelled = true;
    };
  }, [id]);
  if (error)
    return (
      <Container>
        <AdminError>{error}</AdminError>
        <AdminButton onClick={() => navigate("/admin/usuarios")}>
          Voltar
        </AdminButton>
      </Container>
    );
  if (!item) return <AdminLoading text="Carregando usuário..." />;
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));
  return (
    <Container>
      <HeaderActions>
        <AdminButton
          variant="outline"
          onClick={() => navigate("/admin/usuarios")}
        >
          <FiArrowLeft />
          Voltar
        </AdminButton>
        <AdminButton onClick={() => navigate(`/admin/usuarios/${id}/editar`)}>
          <FiEdit2 />
          Editar
        </AdminButton>
      </HeaderActions>
      <AdminPageHeader
        title={userName(item)}
        subtitle="Informações e acesso ao painel."
      />
      <AdminFormCard>
        <AdminSection title="Dados do usuário">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Nome" value={item.firstName} />
            <AdminDescriptionItem label="Sobrenome" value={item.lastName} />
            <AdminDescriptionItem label="E-mail" value={item.email} />
            <AdminDescriptionItem
              label="Nível de acesso"
              value={formatUserRole(item.role)}
            />
            <AdminDescriptionItem
              label="Status"
              value={item.isActive ? "Ativo" : "Inativo"}
            />
            <AdminDescriptionItem
              label="Criado em"
              value={formatDate(item.createdAt)}
            />
            <AdminDescriptionItem
              label="Atualizado em"
              value={formatDate(item.updatedAt)}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}
