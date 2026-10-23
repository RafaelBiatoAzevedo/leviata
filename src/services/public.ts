import type { GalleryResource } from "../admin/services/gallery";
import { loadAllPages } from "../utils/loadAllPages";
import { api } from "./api";

export type PublicResource =
  | GalleryResource
  | "schedule"
  | "newsletter"
  | "news"
  | "books"
  | "articles"
  | "people"
  | "videos"
  | "thematics"
  | "researchInstruments";

export interface PublicListQuery {
  type?: string;
  isActive?: "true" | "false";
  isInternal?: "true" | "false";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export function publicRecordPath(resource: PublicResource, identifier: string) {
  const isId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      identifier,
    );
  return `/${resource}/${isId ? "" : "slug/"}${encodeURIComponent(identifier)}`;
}

export const publicService = {
  getAll<T>(
    resource: PublicResource,
    query: PublicListQuery = {},
    signal?: AbortSignal,
  ) {
    return loadAllPages((page) =>
      api.get<T[]>(`/${resource}`, { params: { ...query, ...page }, signal }),
    );
  },
  getRecord<T>(
    resource: PublicResource,
    identifier: string,
    signal?: AbortSignal,
  ) {
    return api.get<T>(publicRecordPath(resource, identifier), { signal });
  },
};
