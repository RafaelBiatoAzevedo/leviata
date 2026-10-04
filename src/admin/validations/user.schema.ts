import { z } from "zod";

export function createUserSchema({
  isEdit,
  isAccount,
  originalEmail,
}: {
  isEdit: boolean;
  isAccount: boolean;
  originalEmail: string;
}) {
  return z
    .object({
      firstName: z.string().trim().max(100, "Use até 100 caracteres."),
      lastName: z.string().trim().max(100, "Use até 100 caracteres."),
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Informe um e-mail válido.")
        .max(254, "Use até 254 caracteres."),
      role: z.enum(["ADMIN", "SUPER_ADMIN"]),
      isActive: z.boolean(),
      password: z
        .string()
        .refine(
          (value) => (isEdit && !value) || value.length >= 8,
          "Use pelo menos 8 caracteres.",
        )
        .refine(
          (value) => new TextEncoder().encode(value).length <= 72,
          "A senha deve ter no máximo 72 bytes.",
        ),
      confirmPassword: z.string(),
      currentPassword: z.string(),
    })
    .superRefine((data, context) => {
      if (data.password !== data.confirmPassword)
        context.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "As senhas não coincidem.",
        });
      if (
        isAccount &&
        (data.password || data.email !== originalEmail) &&
        !data.currentPassword
      )
        context.addIssue({
          code: "custom",
          path: ["currentPassword"],
          message: "Informe sua senha atual.",
        });
    });
}

export type UserFormData = z.infer<ReturnType<typeof createUserSchema>>;
