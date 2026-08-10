import { api } from "../../services/api";
import type { BookResponseDto } from "../dto/books/BookResponseDto";
import type { CoverBookResponseDto } from "../dto/books/CoverBookResponseDto";
import type { CreateBookRequestDto } from "../dto/books/CreateBookRequestDto";
import type { UpdateBookRequestDto } from "../dto/books/UpdateBookRequestDto";

export const booksService = {
  create(data: CreateBookRequestDto, cover?: File) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

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
      formData.append("image", cover);
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

  updateImage(slug: string, image: File) {
    const formData = new FormData();

    formData.append("image", image);

    return api.patch<CoverBookResponseDto>(
      `/books/slug/${slug}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  removeImage(slug: string) {
    return api.delete(`/books/slug/${slug}`);
  },
};
