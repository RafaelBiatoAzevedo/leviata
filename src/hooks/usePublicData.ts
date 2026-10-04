import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { GalleryResource } from "../admin/services/gallery";

export function usePublicList<T>(resource: GalleryResource) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function load() {
      setLoading(true);
      setError(false);
      setData([]);
      try {
        const records: T[] = [];
        for (let page = 1; ; page++) {
          const response = await api.get<T[]>(`/${resource}`, {
            params: { page, limit: 100 },
            signal: controller.signal,
          });
          records.push(...response.data);
          if (response.data.length < 100) break;
        }
        if (active) setData(records);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [resource]);

  return { data, loading, error };
}

export function usePublicRecord<T>(
  resource: GalleryResource,
  identifier?: string,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function load() {
      setData(null);
      setLoading(true);
      setError(false);
      try {
        if (!identifier) throw new Error("Registro não informado.");
        const isId =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            identifier,
          );
        const response = await api.get<T>(
          `/${resource}/${isId ? "" : "slug/"}${encodeURIComponent(identifier)}`,
          { signal: controller.signal },
        );
        if (active) setData(response.data);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [resource, identifier]);

  return { data, loading, error };
}
