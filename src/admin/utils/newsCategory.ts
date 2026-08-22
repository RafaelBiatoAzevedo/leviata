import {
  NewsCategory,
  newsCategoryLabels,
  type TNewsCategory,
} from "../types/TNewsCategory";

export const newsCategoryOptions = [
  ...(Object.values(NewsCategory) as TNewsCategory[]).map((category) => ({
    value: category,
    label: newsCategoryLabels[category],
  })),
];
