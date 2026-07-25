import { PersonCategory } from "../../../../enums/person-category";
import type { PersonFormData } from "./schema";

export const personDefaultValues: PersonFormData = {
  slug: "",

  name: "",

  category: PersonCategory.DISCENTE,

  isActive: true,

  displayOrder: 0,

  imageUrl: "",

  birthDate: "",

  bio: "",

  orcid: "",

  email: "",

  lattesUrl: "",

  website: "",

  linkedinUrl: "",

  honorificTitle: "",

  nationalityId: "",

  academicTitleId: "",

  institutionId: "",
};
