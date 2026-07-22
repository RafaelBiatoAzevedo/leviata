import type { CreatePersonDto } from "../dto/people/create-person.dto";
import type { UpdatePersonDto } from "../dto/people/update-person.dto";
import { api } from "./api";

export const peopleService = {
  getAll() {
    return api.get("/people");
  },

  getById(id: string) {
    return api.get(`/people/${id}`);
  },

  create(data: CreatePersonDto) {
    return api.post("/people", data);
  },

  update(id: string, data: UpdatePersonDto) {
    return api.patch(`/people/${id}`, data);
  },

  remove(id: string) {
    return api.delete(`/people/${id}`);
  },
};
