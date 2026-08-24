import { api } from "../../services/api";
import type { BoardResponseDto } from "../dtos/boards/BoardResponseDto";
import type { CreateBoardRequestDto } from "../dtos/boards/CreateBoardRequestDto";
import type { UpdateBoardRequestDto } from "../dtos/boards/UpdateBoardRequestDto";

export const boardsService = {
  create(data: CreateBoardRequestDto) {
    return api.post<BoardResponseDto>("/boards", data);
  },

  getAll() {
    return api.get<BoardResponseDto[]>("/boards");
  },

  getById(id: string) {
    return api.get<BoardResponseDto>(`/boards/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<BoardResponseDto>(`/boards/slug/${slug}`);
  },

  updateById(id: string, data: UpdateBoardRequestDto) {
    return api.patch<BoardResponseDto>(`/boards/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/boards/${id}`);
  },

  updateBySlug(slug: string, data: UpdateBoardRequestDto) {
    return api.patch<BoardResponseDto>(`/boards/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/boards/slug/${slug}`);
  },
};
