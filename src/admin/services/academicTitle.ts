import { api } from "../../services/api";

export const academicTitleService = {
  getAll() {
    return api.get("/academic-titles");
  },
};
