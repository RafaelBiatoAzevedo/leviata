import { useEffect, useState } from "react";
import {
  publicService,
  type PublicListQuery,
  type PublicResource,
} from "../services/public";

export function usePublicList<T>(
  resource: PublicResource,
  query: PublicListQuery = {},
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { type, isActive, sortBy, sortOrder, search } = query;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function load() {
      setLoading(true);
      setError(false);
      setData([]);
      try {
        const records = await publicService.getAll<T>(
          resource,
          { type, isActive, sortBy, sortOrder, search },
          controller.signal,
        );
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
  }, [resource, type, isActive, sortBy, sortOrder, search]);

  return { data, loading, error };
}

export function usePublicRecord<T>(
  resource: PublicResource,
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
        const response = await publicService.getRecord<T>(
          resource,
          identifier,
          controller.signal,
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
