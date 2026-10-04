import { api } from "../../services/api";
import type {
  AdminListQuery,
  PaginatedResponseDto,
} from "../dtos/PaginatedResponseDto";
import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UpdateAccountRequestDto,
  UserResponseDto,
} from "../dtos/users/UserResponseDto";

export const usersService = {
  getPage(params: AdminListQuery = {}, signal?: AbortSignal) {
    return api.get<PaginatedResponseDto<UserResponseDto>>("/users/paginated", {
      params,
      signal,
    });
  },
  getById(id: string) {
    return api.get<UserResponseDto>(`/users/${id}`);
  },
  create(data: CreateUserRequestDto) {
    return api.post<UserResponseDto>("/users", data);
  },
  updateById(id: string, data: UpdateUserRequestDto) {
    return api.patch<UserResponseDto>(`/users/${id}`, data);
  },
  removeById(id: string) {
    return api.delete(`/users/${id}`);
  },
  getAccount() {
    return api.get<UserResponseDto>("/users/me");
  },
  updateAccount(data: UpdateAccountRequestDto) {
    return api.patch<UserResponseDto>("/users/me", data);
  },
};
