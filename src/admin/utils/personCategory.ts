import { PersonCategory, personCategoryLabels } from "../enums/person-category";

export const personCategoryOptions = [
  {
    value: "",
    label: "Todas",
  },
  ...(Object.values(PersonCategory) as PersonCategory[]).map((category) => ({
    value: category,
    label: personCategoryLabels[category],
  })),
];
