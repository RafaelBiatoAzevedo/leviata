import { useEffect, useState } from "react";
import type { ThematicResponseDto } from "../admin/dtos/thematics/ThematicResponseDto";
import { thematicsService } from "../admin/services/thematics";

export function useThematics() {
  const [thematics, setThematics] = useState<ThematicResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    thematicsService
      .getAllAvailable(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setThematics(items);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Não foi possível carregar as linhas temáticas.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  return { thematics, loading, error };
}
