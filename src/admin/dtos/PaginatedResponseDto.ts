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
  category?: string;
  type?: string;
  role?: string;
  isActive?: string;
}

export type AdminListFilters = Pick<
  AdminListQuery,
  "search" | "category" | "type" | "role" | "isActive"
>;
