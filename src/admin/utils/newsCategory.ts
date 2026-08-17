import {
  NewsCategory,
  newsCategoryLabels,
  type TNewsCategory,
} from "../enums/NewsCategory";

export const newsCategoryOptions = [
  ...(Object.values(NewsCategory) as TNewsCategory[]).map((category) => ({
    value: category,
    label: newsCategoryLabels[category],
  })),
];
