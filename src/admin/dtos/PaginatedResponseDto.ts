export interface PaginatedResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  type?: string;
  role?: string;
  isActive?: string;
  isInternal?: "true" | "false";
  countryId?: string;
}

export type AdminListFilters = Pick<
  AdminListQuery,
  | "search"
  | "sortBy"
  | "sortOrder"
  | "category"
  | "type"
  | "role"
  | "isActive"
  | "isInternal"
  | "countryId"
>;
