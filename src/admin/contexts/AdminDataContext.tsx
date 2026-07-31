import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { countryService } from "../services/country";
import { institutionService } from "../services/institution";
import { academicTitleService } from "../services/academicTitle";

import type { CountryResponseDto } from "../dto/CountryResponseDto";
import type { InstitutionResponseDto } from "../dto/InstitutionResponseDto";
import type { AcademicTitleResponseDto } from "../dto/AcademicTitleResponseDto";

interface AdminDataContextData {
  countries: CountryResponseDto[];
  institutions: InstitutionResponseDto[];
  academicTitles: AcademicTitleResponseDto[];

  isLoading: boolean;

  reloadCountries(): Promise<void>;
  reloadInstitutions(): Promise<void>;
  reloadAcademicTitles(): Promise<void>;
  reloadAll(): Promise<void>;
}

export const AdminDataContext = createContext({} as AdminDataContextData);

interface Props {
  children: React.ReactNode;
}

export function AdminDataProvider({ children }: Props) {
  const [countries, setCountries] = useState<CountryResponseDto[]>([]);
  const [institutions, setInstitutions] = useState<InstitutionResponseDto[]>(
    [],
  );
  const [academicTitles, setAcademicTitles] = useState<
    AcademicTitleResponseDto[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const reloadCountries = useCallback(async () => {
    const response = await countryService.getAll();

    setCountries(response.data);
  }, []);

  const reloadInstitutions = useCallback(async () => {
    const response = await institutionService.getAll();

    setInstitutions(response.data);
  }, []);

  const reloadAcademicTitles = useCallback(async () => {
    const response = await academicTitleService.getAll();

    setAcademicTitles(response.data);
  }, []);

  const reloadAll = useCallback(async () => {
    setIsLoading(true);

    try {
      const [countriesResponse, institutionsResponse, academicTitlesResponse] =
        await Promise.all([
          countryService.getAll(),
          institutionService.getAll(),
          academicTitleService.getAll(),
        ]);

      setCountries(countriesResponse.data);

      setInstitutions(institutionsResponse.data);

      setAcademicTitles(academicTitlesResponse.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadAll();
  }, [reloadAll]);

  const value = useMemo(
    () => ({
      countries,
      institutions,
      academicTitles,

      isLoading,

      reloadCountries,
      reloadInstitutions,
      reloadAcademicTitles,
      reloadAll,
    }),
    [
      countries,
      institutions,
      academicTitles,
      isLoading,
      reloadCountries,
      reloadInstitutions,
      reloadAcademicTitles,
      reloadAll,
    ],
  );

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}
