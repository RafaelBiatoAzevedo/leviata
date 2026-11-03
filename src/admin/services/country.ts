import { api } from "../../services/api";
import type { CountryResponseDto } from "../dtos/CountryResponseDto";

export const countryService = {
  getAll(signal?: AbortSignal) {
    return api.get<CountryResponseDto[]>("/countries", { signal });
  },
};
