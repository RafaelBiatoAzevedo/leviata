import { api } from "../../services/api";

export const institutionService = {
  getAll() {
    return api.get("/institutions");
  },
};
