import type { CountryResponseDto } from "./CountryResponseDto";

export interface InstitutionResponseDto {
  id: string;

  name: string;

  acronym: string;

  countryId: string;

  country?: CountryResponseDto;

  createdAt: string;

  updatedAt: string;
}
