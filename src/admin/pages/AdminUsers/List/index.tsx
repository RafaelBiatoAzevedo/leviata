import { useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../hooks/useModal";
import { useToast } from "../../../../hooks/useToast";
import { useAuth } from "../../../hooks/useAuth";
import { useAdminList } from "../../../hooks/useAdminList";
import { usersService } from "../../../services/users";
import type { UserResponseDto } from "../../../dtos/users/UserResponseDto";
import {
  formatUserRole,
  userErrorMessage,
  userName,
  userRoleOptions,
} from "../../../utils/users";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminButton } from "../../../components/AdminButton";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminBadge } from "../../../components/AdminBadge";
import { AdminTable } from "../../../components/AdminTable";
import { AdminPagination } from "../../../components/AdminPagination";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import { AdminError } from "../../../components/AdminError";
import { AdminLoading } from "../../../components/AdminLoading";
import { Container, Actions, Empty, Filters } from "../styles";

export function AdminUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const { user } = useAuth();
  const { showModal } = useModal();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { items, loading, error, load, pagination } = useAdminList(
    usersService.getPage,
    {
      search: search.trim() || undefined,
      role: role || undefined,
      isActive: isActive || undefined,
    },
  );

  function remove(item: UserResponseDto) {
    showModal({
      title: "Excluir usuário",
      content: <AdminDeleteContent title={userName(item)} />,
      confirmText: "Excluir",
      cancelText: "Cancelar",
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await usersService.removeById(item.id);
          showToast({
            title: "Usuário excluído",
            description: item.email,
            type: "success",
          });
          load();
        } catch (error) {
          showToast({
            title: "Erro ao excluir usuário",
            description: userErrorMessage(error),
            type: "danger",
          });
          throw error;
        }
      },
    });
  }

  return (
    <Container>
      <AdminPageHeader
        title="Usuários"
        subtitle="Gerencie as contas e os acessos ao painel."
      >
        <AdminButton onClick={() => navigate("/admin/usuarios/novo")}>
          <FiPlus />
          Novo usuário
        </AdminButton>
      </AdminPageHeader>
      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pesquisar por nome ou e-mail..."
        />
        <AdminSelect
          label="Nível de acesso"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          options={[{ value: "", label: "Todos" }, ...userRoleOptions]}
        />
        <AdminSelect
          label="Status"
          value={isActive}
          onChange={(event) => setIsActive(event.target.value)}
          options={[
            { value: "", label: "Todos" },
            { value: "true", label: "Ativos" },
            { value: "false", label: "Inativos" },
          ]}
        />
      </Filters>
      {error && (
        <AdminError>
          {error}
          <AdminButton variant="outline" onClick={load}>
            Tentar novamente
          </AdminButton>
        </AdminError>
      )}
      {loading ? (
        <AdminLoading text="Carregando usuários..." />
      ) : (
        !error && (
          <>
            <AdminTable>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Nível de acesso</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{userName(item)}</strong>
                      {item.id === user?.id && <small>Sua conta</small>}
                    </td>
                    <td>{item.email}</td>
                    <td>{formatUserRole(item.role)}</td>
                    <td>
                      <AdminBadge
                        variant={item.isActive ? "success" : "danger"}
                      >
                        {item.isActive ? "Ativo" : "Inativo"}
                      </AdminBadge>
                    </td>
                    <td>
                      <Actions>
                        <AdminIconButton
                          title="Visualizar"
                          onClick={() => navigate(`/admin/usuarios/${item.id}`)}
                        >
                          <FiEye />
                        </AdminIconButton>
                        <AdminIconButton
                          title="Editar"
                          onClick={() =>
                            navigate(`/admin/usuarios/${item.id}/editar`)
                          }
                        >
                          <FiEdit2 />
                        </AdminIconButton>
                        <AdminIconButton
                          title={
                            item.id === user?.id
                              ? "Você não pode excluir sua própria conta"
                              : "Excluir"
                          }
                          disabled={item.id === user?.id}
                          onClick={() => remove(item)}
                        >
                          <FiTrash2 />
                        </AdminIconButton>
                      </Actions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
            {items.length === 0 && <Empty>Nenhum usuário encontrado.</Empty>}
          </>
        )
      )}
      <AdminPagination {...pagination} />
    </Container>
  );
}
