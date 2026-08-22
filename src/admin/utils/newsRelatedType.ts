import {
  NewsRelatedType,
  newsRelatedTypeLabels,
  type TNewsRelatedType,
} from "../types/TNewsRelatedType";

export const newsRelatedTypeOptions = [
  ...(Object.values(NewsRelatedType) as TNewsRelatedType[]).map((category) => ({
    value: category,
    label: newsRelatedTypeLabels[category],
  })),
];
