export type UserRole = "ADMIN" | "SUPER_ADMIN";

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequestDto {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  password: string;
  role?: UserRole;
  isActive?: boolean;
}

export type UpdateUserRequestDto = Partial<CreateUserRequestDto>;

export interface UpdateAccountRequestDto {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  password?: string;
  currentPassword?: string;
}
