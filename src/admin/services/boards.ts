import { api } from "../../services/api";
import type { BookResponseDto } from "../dtos/books/BookResponseDto";
import type { CreateBookRequestDto } from "../dtos/books/CreateBookRequestDto";
import type { UpdateBookRequestDto } from "../dtos/books/UpdateBookRequestDto";
import type { ImageUploadResponseDto } from "../dtos/ImageUploadResponseDto";

export const booksService = {
  create(data: CreateBookRequestDto, cover?: File) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      if (typeof value === "boolean") {
        formData.append(key, String(value));
        return;
      }

      if (typeof value === "number") {
        formData.append(key, String(value));
        return;
      }

      formData.append(key, value);
    });

    if (cover) {
      formData.append("cover", cover);
    }

    return api.post<BookResponseDto>("/books", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll() {
    return api.get<BookResponseDto[]>("/books");
  },

  getById(id: string) {
    return api.get<BookResponseDto>(`/books/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<BookResponseDto>(`/books/slug/${slug}`);
  },

  updateById(id: string, data: UpdateBookRequestDto) {
    return api.patch<BookResponseDto>(`/books/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/books/${id}`);
  },

  updateBySlug(slug: string, data: UpdateBookRequestDto) {
    return api.patch<BookResponseDto>(`/books/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/books/slug/${slug}`);
  },

  updateCover(slug: string, cover: File) {
    const formData = new FormData();

    formData.append("cover", cover);

    return api.patch<ImageUploadResponseDto>(
      `/books/slug/${slug}/cover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  removeCover(slug: string) {
    return api.delete(`/books/slug/${slug}/cover`);
  },
};
