import type { CreatePersonDto } from "../dto/people/create-person.dto";
import type { PersonResponseDto } from "../dto/people/people-response.dto";
import type { UpdatePersonDto } from "../dto/people/update-person.dto";
import { api } from "./api";

export const peopleService = {
  create(data: CreatePersonDto) {
    return api.post("/people", data);
  },

  getAll() {
    return api.get<PersonResponseDto[]>("/people");
  },

  getById(id: string) {
    return api.get<PersonResponseDto>(`/people/${id}`);
  },

  getBySlug(slug: string) {
    return api.get<PersonResponseDto>(`/people/slug/${slug}`);
  },

  updateById(id: string, data: UpdatePersonDto) {
    return api.patch<PersonResponseDto>(`/people/${id}`, data);
  },

  removeById(id: string) {
    return api.delete(`/people/${id}`);
  },

  updateBySlug(slug: string, data: UpdatePersonDto) {
    return api.patch<PersonResponseDto>(`/people/slug/${slug}`, data);
  },

  removeBySlug(slug: string) {
    return api.delete(`/people/${slug}`);
  },
};
