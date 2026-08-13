import { api } from "../../services/api";
import type { ArticleResponseDto } from "../dto/articles/ArticleResponseDto";
import type { CreateArticleRequestDto } from "../dto/articles/CreateArticleRequestDto";
import type { UpdateArticleDto } from "../dto/articles/UpdateArticleRequestDto";
import type { ImageUploadResponseDto } from "../dto/ImageUploadResponseDto";

export const articlesService = {
  create(data: CreateArticleRequestDto, image?: File) {
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

    if (image) {
      formData.append("image", image);
    }

    return api.post<ImageUploadResponseDto>("/article", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll() {
    return api.get<ArticleResponseDto[]>("/article");
  },

  getById(id: string) {
    return api.get<ArticleResponseDto>(`/article/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<ArticleResponseDto>(`/article/slug/${slug}`);
  },

  updateById(id: string, data: UpdateArticleDto) {
    return api.patch<ArticleResponseDto>(`/article/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/article/${id}`);
  },

  updateBySlug(slug: string, data: UpdateArticleDto) {
    return api.patch<ArticleResponseDto>(`/article/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/article/slug/${slug}`);
  },

  updateImage(slug: string, image: File) {
    const formData = new FormData();

    formData.append("image", image);

    return api.patch<ImageUploadResponseDto>(
      `/article/slug/${slug}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  removeImage(slug: string) {
    return api.delete(`/article/slug/${slug}/image`);
  },
};
