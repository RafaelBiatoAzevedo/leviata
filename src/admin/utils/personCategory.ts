import {
  PersonCategory,
  personCategoryLabels,
  type TPersonCategory,
} from "../enums/PersonCategory";

export const personCategoryOptions = [
  ...(Object.values(PersonCategory) as TPersonCategory[]).map((category) => ({
    value: category,
    label: personCategoryLabels[category],
  })),
];
