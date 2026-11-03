import { createContext, useContext } from "react";
import type { ActivityCategory } from "../utils/activities";

interface ActivitiesState {
  activities: ActivityCategory[];
  loading: boolean;
  error: boolean;
}

export const ActivitiesContext = createContext<ActivitiesState>({
  activities: [],
  loading: true,
  error: false,
});

export function useActivities() {
  return useContext(ActivitiesContext);
}
