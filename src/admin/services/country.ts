import { api } from "../../services/api";

export const countryService = {
  getAll() {
    return api.get("/countries");
  },
};
