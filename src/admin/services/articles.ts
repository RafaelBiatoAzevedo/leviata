import { api } from "../../services/api";
import type { ArticleResponseDto } from "../dtos/articles/ArticleResponseDto";
import type { CreateArticleRequestDto } from "../dtos/articles/CreateArticleRequestDto";
import type { UpdateArticleDto } from "../dtos/articles/UpdateArticleRequestDto";
import type { ImageUploadResponseDto } from "../dtos/ImageUploadResponseDto";

export const articlesService = {
  create(data: CreateArticleRequestDto, cover?: File) {
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

    return api.post<ImageUploadResponseDto>("/articles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll() {
    return api.get<ArticleResponseDto[]>("/articles");
  },

  getById(id: string) {
    return api.get<ArticleResponseDto>(`/articles/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<ArticleResponseDto>(`/articles/slug/${slug}`);
  },

  updateById(id: string, data: UpdateArticleDto) {
    return api.patch<ArticleResponseDto>(`/articles/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/articles/${id}`);
  },

  updateBySlug(slug: string, data: UpdateArticleDto) {
    return api.patch<ArticleResponseDto>(`/articles/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/articles/slug/${slug}`);
  },

  updateCover(slug: string, cover: File) {
    const formData = new FormData();

    formData.append("cover", cover);

    return api.patch<ImageUploadResponseDto>(
      `/articles/slug/${slug}/cover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  removeImage(slug: string) {
    return api.delete(`/articles/slug/${slug}/cover`);
  },
};
