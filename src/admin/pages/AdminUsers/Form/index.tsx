import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useAuth } from "../../../hooks/useAuth";
import { usersService } from "../../../services/users";
import {
  createUserSchema,
  type UserFormData,
} from "../../../validations/user.schema";
import type { UserResponseDto } from "../../../dtos/users/UserResponseDto";
import {
  userErrorMessage,
  userRoleOptions,
  formatUserRole,
} from "../../../utils/users";
import { AdminInput } from "../../../components/AdminInput";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminSwitch } from "../../../components/AdminSwitch";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminSection } from "../../../components/AdminSection";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminError } from "../../../components/AdminError";
import { AdminButton } from "../../../components/AdminButton";
import AdminFormActions from "../../../components/AdminFormActions";
import { Container, Form } from "../styles";

export function UserForm({ account = false }: { account?: boolean }) {
  const { id } = useParams();
  return (
    <UserEditor
      key={account ? "account" : (id ?? "new")}
      account={account}
      id={id}
    />
  );
}

function UserEditor({ account, id }: { account: boolean; id?: string }) {
  const isEdit = account || Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, updateUser, signOut } = useAuth();
  const [item, setItem] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(
      createUserSchema({
        isEdit,
        isAccount: account,
        originalEmail: item?.email ?? "",
      }),
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      currentPassword: "",
      role: "ADMIN",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    const request = account
      ? usersService.getAccount()
      : usersService.getById(id!);
    request
      .then(({ data }) => {
        if (cancelled) return;
        setItem(data);
        reset({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email,
          role: data.role,
          isActive: data.isActive,
          password: "",
          confirmPassword: "",
          currentPassword: "",
        });
      })
      .catch((error: unknown) => {
        if (!cancelled) setError(userErrorMessage(error));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [account, id, isEdit, reset]);

  async function onSubmit(data: UserFormData) {
    try {
      const profile = {
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        ...(data.password && { password: data.password }),
      };
      const access = { ...profile, role: data.role, isActive: data.isActive };
      const response = account
        ? await usersService.updateAccount({
            ...profile,
            ...(data.currentPassword && {
              currentPassword: data.currentPassword,
            }),
          })
        : id
          ? await usersService.updateById(id, access)
          : await usersService.create({ ...access, password: data.password });
      const ownAccount = account || response.data.id === user?.id;
      if (ownAccount && (data.password || data.email !== user?.email)) {
        signOut();
        showToast({
          title: "Conta atualizada",
          description: "Entre novamente com suas credenciais atualizadas.",
          type: "success",
        });
        navigate("/admin/login", { replace: true });
        return;
      }
      if (ownAccount) updateUser(response.data);
      showToast({
        title: account
          ? "Conta atualizada"
          : isEdit
            ? "Usuário atualizado"
            : "Usuário cadastrado",
        description: "Os dados foram salvos com sucesso.",
        type: "success",
      });
      if (account)
        reset({
          ...data,
          password: "",
          confirmPassword: "",
          currentPassword: "",
        });
      else navigate("/admin/usuarios");
    } catch (error) {
      showToast({
        title: "Erro ao salvar usuário",
        description: userErrorMessage(error),
        type: "danger",
      });
    }
  }

  if (loading) return <AdminLoading text="Carregando conta..." />;
  if (error)
    return (
      <Container>
        <AdminError>{error}</AdminError>
        <AdminButton
          variant="outline"
          onClick={() => navigate(account ? "/admin" : "/admin/usuarios")}
        >
          Voltar
        </AdminButton>
      </Container>
    );
  const ownAccount = item?.id === user?.id;

  return (
    <Container>
      <AdminPageHeader
        title={
          account ? "Minha conta" : isEdit ? "Editar usuário" : "Novo usuário"
        }
        subtitle={
          account
            ? "Atualize seu perfil e suas credenciais de acesso."
            : "Cadastre e gerencie o acesso ao painel."
        }
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <AdminFormCard>
          <AdminSection title="Dados da conta">
            <AdminFormGrid>
              <AdminInput
                label="Nome"
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <AdminInput
                label="Sobrenome"
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...register("lastName")}
              />
              <AdminInput
                label="E-mail"
                type="email"
                autoComplete="username"
                required
                error={errors.email?.message}
                {...register("email")}
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>
        {!account && (
          <AdminFormCard>
            <AdminSection title="Permissões de acesso">
              <AdminFormGrid>
                {ownAccount ? (
                  <>
                    <AdminInput
                      label="Nível de acesso"
                      value={formatUserRole(item!.role)}
                      readOnly
                      description="O nível de acesso da própria conta não pode ser alterado."
                    />
                    <AdminInput
                      label="Status"
                      value={item!.isActive ? "Ativo" : "Inativo"}
                      readOnly
                      description="A própria conta deve permanecer ativa."
                    />
                  </>
                ) : (
                  <>
                    <AdminSelect
                      label="Nível de acesso"
                      options={userRoleOptions}
                      description="Administradores gerenciam o conteúdo. Superadministradores também gerenciam usuários."
                      error={errors.role?.message}
                      {...register("role")}
                    />
                    <AdminSwitch
                      label="Conta ativa"
                      text="Permitir acesso ao painel"
                      error={errors.isActive?.message}
                      {...register("isActive")}
                    />
                  </>
                )}
              </AdminFormGrid>
            </AdminSection>
          </AdminFormCard>
        )}
        <AdminFormCard>
          <AdminSection title={isEdit ? "Alterar senha" : "Senha de acesso"}>
            <AdminFormGrid>
              {account && (
                <AdminInput
                  label="Senha atual"
                  type="password"
                  autoComplete="current-password"
                  description="Necessária para alterar seu e-mail ou senha. Depois da alteração, entre novamente."
                  error={errors.currentPassword?.message}
                  {...register("currentPassword")}
                />
              )}
              <AdminInput
                label={isEdit ? "Nova senha" : "Senha"}
                type="password"
                autoComplete="new-password"
                required={!isEdit}
                description={
                  isEdit
                    ? "Deixe em branco para manter a senha atual. Use pelo menos 8 caracteres."
                    : "Use pelo menos 8 caracteres."
                }
                error={errors.password?.message}
                {...register("password")}
              />
              <AdminInput
                label="Confirmar senha"
                type="password"
                autoComplete="new-password"
                required={!isEdit}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>
        <AdminFormActions isSubmitting={isSubmitting} />
      </Form>
    </Container>
  );
}
