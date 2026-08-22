import {
  PersonCategory,
  personCategoryLabels,
  type TPersonCategory,
} from "../types/TPersonCategory";

export const personCategoryOptions = [
  ...(Object.values(PersonCategory) as TPersonCategory[]).map((category) => ({
    value: category,
    label: personCategoryLabels[category],
  })),
];
