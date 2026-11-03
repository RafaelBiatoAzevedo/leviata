import type { ReactNode } from "react";
import { usePublicList } from "../hooks/usePublicData";
import {
  availableActivityCategories,
  type ActivityRecord,
} from "../utils/activities";
import { ActivitiesContext } from "./activities-context";

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const research = usePublicList<ActivityRecord>("research");
  const juries = usePublicList<ActivityRecord>("juries");
  const meetings = usePublicList<ActivityRecord>("meetings", {
    isInternal: "true",
  });
  const activities = availableActivityCategories({
    research: research.loading || research.error ? [] : research.data,
    juries: juries.loading || juries.error ? [] : juries.data,
    meetings: meetings.loading || meetings.error ? [] : meetings.data,
  });

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        loading: research.loading || juries.loading || meetings.loading,
        error: research.error || juries.error || meetings.error,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
}
