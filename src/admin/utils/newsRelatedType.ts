import {
  NewsRelatedType,
  newsRelatedTypeLabels,
  type TNewsRelatedType,
} from "../enums/NewsRelatedType";

export const newsRelatedTypeOptions = [
  ...(Object.values(NewsRelatedType) as TNewsRelatedType[]).map((category) => ({
    value: category,
    label: newsRelatedTypeLabels[category],
  })),
];
