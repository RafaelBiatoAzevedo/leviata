import { PersonCategory, personCategoryLabels } from "../enums/person-category";

export const personCategoryOptions = [
  ...(Object.values(PersonCategory) as PersonCategory[]).map((category) => ({
    value: category,
    label: personCategoryLabels[category],
  })),
];
